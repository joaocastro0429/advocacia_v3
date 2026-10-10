import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GettingStarted() {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div><h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900"><Users size={22} aria-hidden="true" />Seu primeiro passo no PrevFluxo</h2><p className="mt-2 text-sm text-slate-600">Cadastre um cliente. Depois, vincule um processo e organize um compromisso.</p><Link to="/perfil" className="mt-3 inline-block text-sm font-medium text-slate-700 underline">Completar meu perfil profissional</Link></div>
        <Button asChild className="h-auto whitespace-normal py-3"><Link to="/clientes">Cadastrar meu primeiro cliente <ArrowRight size={16} aria-hidden="true" /></Link></Button>
      </div>
    </section>
  );
}
