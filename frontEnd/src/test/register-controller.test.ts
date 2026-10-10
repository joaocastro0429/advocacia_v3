import { beforeEach, expect, it, vi } from "vitest";
import { RegisterController } from "../../../backEnd/src/login/controllers/register";

const register = vi.hoisted(() => vi.fn());
vi.mock("../../../backEnd/src/login/services/register.service.js", () => ({ Register: register }));
beforeEach(() => { vi.clearAllMocks(); register.mockResolvedValue({ id: "test", name: "Teste", email: "teste@example.com" }); });

function response() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}
it("aceita cadastro sem especialidade no backend", async () => {
  const body = { name: "Teste", email: "teste@example.com", oabNumber: "123456", password: "Teste!2026" };
  const res = response();
  await RegisterController({ body } as never, res as never, vi.fn());
  expect(res.status).toHaveBeenCalledWith(201);
  expect(register).toHaveBeenCalledWith({ ...body, specialty: undefined });
});
it("continua exigindo a OAB antes de criar a conta", async () => {
  const res = response();
  await RegisterController({ body: { name: "Teste", email: "teste@example.com", password: "Teste!2026" } } as never, res as never, vi.fn());
  expect(res.status).toHaveBeenCalledWith(400);
  expect(register).not.toHaveBeenCalled();
});
