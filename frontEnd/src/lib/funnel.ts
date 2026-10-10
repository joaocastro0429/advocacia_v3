type FunnelEvent = "landing_view" | "signup_cta_click" | "demo_view" | "demo_step" | "signup_view" | "signup_start" | "signup_complete" | "activation";
type FunnelContext = { placement?: "header" | "hero" | "demo" | "footer"; step?: "clientes" | "processos" | "agenda"; action?: "client_created" | "case_created" | "event_created" };

/** Only controlled labels; never send form values, IDs or URL parameters. */
export function trackFunnel(event: FunnelEvent, context: FunnelContext = {}) {
  try {
    const payload = { event: `prevfluxo_${event}`, ...context };
    const target = window as Window & { dataLayer?: unknown[] };
    target.dataLayer = target.dataLayer || [];
    target.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("prevfluxo:funnel", { detail: payload }));
  } catch {
    // Measurement must never interrupt registration or a successful operation.
  }
}

export function trackActivation(userId: string | undefined, action: FunnelContext["action"]) {
  if (!userId) return;
  try {
    const key = `prevfluxo:activation:v1:${userId}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    trackFunnel("activation", { action });
  } catch {
    // Storage may be unavailable in private browsers.
  }
}
