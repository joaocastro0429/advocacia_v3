import { useState } from "react";
import { Briefcase, Calendar, CheckCircle2, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { trackFunnel } from "@/lib/funnel";

const steps = [
  { id: "clientes", title: "1. Organize o cliente", icon: Users, description: "Reúna os dados de contato e as anotações do atendimento.", heading: "Cliente cadastrado", name: "Marina Oliveira", detail: "Contato e notas do atendimento em um só cadastro." },
  { id: "processos", title: "2. Acompanhe o processo", icon: Briefcase, description: "Vincule o processo ao cliente e consulte suas informações.", heading: "Processo vinculado", name: "Ação de cobrança", detail: "Cliente: Marina Oliveira · Situação: em andamento." },
  { id: "agenda", title: "3. Planeje o compromisso", icon: Calendar, description: "Organize os compromissos relacionados ao atendimento.", heading: "Compromisso organizado", name: "Reunião de acompanhamento", detail: "Cliente: Marina Oliveira · Horário ilustrativo: 14h." },
] as const;

export function ProductDemo() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
      <div className="space-y-3" aria-label="Etapas da demonstração">
        {steps.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={active === index} aria-controls="demo-preview" onClick={() => { setActive(index); trackFunnel("demo_step", { step: item.id }); }} className={`w-full rounded-xl border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600 ${active === index ? "border-amber-600 bg-amber-50" : "border-slate-200 bg-white hover:border-slate-400"}`}>
            <span className="flex items-center gap-3 font-semibold text-slate-900"><item.icon size={20} aria-hidden="true" />{item.title}</span>
            <span className="mt-2 block text-sm leading-relaxed text-slate-600">{item.description}</span>
          </button>
        ))}
      </div>
      <div id="demo-preview" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-8" aria-live="polite">
        <p className="mb-5 text-xs font-medium uppercase tracking-wider text-slate-600">Demonstração ilustrativa · dados fictícios</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard title="Clientes" value="1" icon={Users} variant="accent" />
          <StatCard title="Processos" value={active > 0 ? "1" : "0"} icon={Briefcase} variant="accent" />
        </div>
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6">
          <p className="flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 size={16} aria-hidden="true" />{step.heading}</p>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">{step.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.detail}</p>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-600">Exemplo de uso dos módulos. As telas completas ficam disponíveis após o login.</p>
      </div>
    </div>
  );
}
