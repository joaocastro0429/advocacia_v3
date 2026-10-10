import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { ProductDemo } from "@/components/marketing/ProductDemo";

const auth = vi.hoisted(() => ({ isAuthenticated: false, loading: false, signUp: vi.fn(), signIn: vi.fn(), resetPassword: vi.fn() }));
vi.mock("@/hooks/useAuth", () => ({ useAuth: () => auth }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock("@/pages/Index", () => ({ default: () => <h1>Painel do escritório</h1> }));
vi.mock("@/components/layout/DashboardLayout", () => ({ DashboardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));

beforeEach(() => { auth.isAuthenticated = false; auth.loading = false; vi.clearAllMocks(); });
afterEach(cleanup);

describe("Entrada pública e acesso existente", () => {
  it("apresenta o produto aos visitantes sem exigir login", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Seu escritório organizado");
    for (const link of screen.getAllByRole("link", { name: "Criar minha conta" })) expect(link).toHaveAttribute("href", "/login?modo=cadastro");
  });
  it("mantém o painel na raiz para usuários autenticados", async () => {
    auth.isAuthenticated = true;
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Painel do escritório" })).toBeInTheDocument();
    expect(screen.queryByText("Seu escritório organizado.")).not.toBeInTheDocument();
  });
  it("não apresenta a página pública enquanto carrega a sessão", () => {
    auth.loading = true;
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByRole("status")).toHaveTextContent("Carregando");
    expect(screen.queryByRole("link", { name: "Entrar" })).not.toBeInTheDocument();
  });
});

describe("Cadastro simplificado", () => {
  it("abre o cadastro pelo CTA e aceita os dados essenciais sem especialidade", async () => {
    auth.signUp.mockResolvedValue({ error: null });
    render(<MemoryRouter initialEntries={["/login?modo=cadastro"]}><Routes><Route path="/login" element={<Login />} /><Route path="/" element={<h1>Cadastro concluído</h1>} /></Routes></MemoryRouter>);
    expect(screen.queryByLabelText("Especialidade")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nome completo"), { target: { value: "Advogado de teste" } });
    fireEvent.change(screen.getByLabelText("Nº da OAB"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teste@example.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "Teste!2026" } });
    fireEvent.click(screen.getByRole("button", { name: "Criar conta" }));
    await waitFor(() => expect(auth.signUp).toHaveBeenCalledWith({ name: "Advogado de teste", oabNumber: "123456", email: "teste@example.com", password: "Teste!2026" }));
    expect(await screen.findByRole("heading", { name: "Cadastro concluído" })).toBeInTheDocument();
  });
  it("mantém o login como padrão da rota de acesso", () => {
    render(<MemoryRouter initialEntries={["/login"]}><Login /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Nº da OAB")).not.toBeInTheDocument();
  });
});

it("permite explorar a demonstração sem chamadas ao servidor", () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  render(<ProductDemo />);
  fireEvent.click(screen.getByRole("button", { name: /2\. Acompanhe o processo/ }));
  expect(screen.getByText("Ação de cobrança")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /3\. Planeje o compromisso/ }));
  expect(screen.getByText("Reunião de acompanhamento")).toBeInTheDocument();
  expect(screen.getByText(/dados fictícios/)).toBeInTheDocument();
  expect(fetchSpy).not.toHaveBeenCalled();
  fetchSpy.mockRestore();
});
