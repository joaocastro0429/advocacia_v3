import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { trackActivation, trackFunnel } from "@/lib/funnel";

type AnalyticsWindow = Window & { dataLayer?: unknown[] };
beforeEach(() => { (window as AnalyticsWindow).dataLayer = []; localStorage.clear(); });
afterEach(() => vi.restoreAllMocks());

it("registra a primeira ação por conta sem enviar o identificador", () => {
  trackActivation("conta-teste", "client_created");
  trackActivation("conta-teste", "case_created");
  trackActivation("outra-conta", "event_created");
  expect((window as AnalyticsWindow).dataLayer).toEqual([
    { event: "prevfluxo_activation", action: "client_created" },
    { event: "prevfluxo_activation", action: "event_created" },
  ]);
});
it("não interrompe operações quando o armazenamento ou o coletor falha", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  expect(() => trackActivation("conta", "client_created")).not.toThrow();
  (window as AnalyticsWindow).dataLayer = { push: () => { throw new Error("collector failed"); } } as unknown as unknown[];
  expect(() => trackFunnel("signup_complete")).not.toThrow();
});
