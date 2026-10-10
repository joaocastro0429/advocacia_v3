import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Calendar, FileText, Scale, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDemo } from "@/components/marketing/ProductDemo";
import { trackFunnel } from "@/lib/funnel";

const features = [
  { icon: Users, title: "Clientes", text: "Centralize contatos e anotações para consultar o histórico de cada atendimento." },
  { icon: Briefcase, title: "Processos", text: "Organize informações, situações e vínculos com os clientes do escritório." },
  { icon: Calendar, title: "Agenda", text: "Mantenha reuniões, audiências e outros compromissos na agenda do escritório." },
  { icon: FileText, title: "Petições", text: "Organize suas petições por tipo e situação, junto aos demais registros." },
];

export default function Landing() {
  useEffect(() => { trackFunnel("landing_view"); }, []);
  const signup = (placement: "header" | "hero" | "demo" | "footer") => () => trackFunnel("signup_cta_click", { placement });
  return (
    <div className="bg-[#faf9f6] text-slate-900">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Pular para o conteúdo</a>
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link to="/" aria-label="PrevFluxo, início" className="flex items-center gap-3 font-serif text-2xl font-bold"><span className="rounded-lg bg-gradient-gold p-2"><Scale size={24} aria-hidden="true" /></span>PrevFluxo</Link>
          <nav aria-label="Navegação principal" className="flex flex-wrap items-center gap-4 text-sm sm:gap-6">
            <a href="#recursos" className="hidden hover:underline sm:inline">Recursos</a>
            <a href="#demonstracao" onClick={() => trackFunnel("demo_view")} className="hover:underline">Demonstração</a>
            <Link to="/login" className="font-semibold hover:underline">Entrar</Link>
            <Button asChild className="hidden sm:inline-flex"><Link to="/login?modo=cadastro" onClick={signup("header")}>Criar conta</Link></Button>
          </nav>
        </div>
      </header>
      <main id="conteudo">
        <section className="bg-gradient-navy text-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Gestão para sua rotina jurídica</p>
              <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">Seu escritório organizado.<br /><span className="text-amber-300">Sua rotina mais clara.</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">Reúna clientes, processos, petições e compromissos no PrevFluxo. Uma visão do trabalho para advogados autônomos e pequenos escritórios.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300"><Link to="/login?modo=cadastro" onClick={signup("hero")}>Criar minha conta <ArrowRight size={18} aria-hidden="true" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="border-slate-500 bg-transparent text-white hover:bg-white/10 hover:text-white"><a href="#demonstracao" onClick={() => trackFunnel("demo_view")}>Ver como funciona</a></Button>
              </div>
              <p className="mt-4 text-sm text-slate-300">Conheça o fluxo de trabalho antes de se cadastrar.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-7 sm:p-9">
              <p className="text-xs uppercase tracking-widest text-amber-300">Um lugar para acompanhar o trabalho</p>
              <h2 className="mt-3 text-2xl">Do atendimento ao próximo compromisso</h2>
              <ol className="mt-7 space-y-6">
                {["Organize os dados do cliente", "Consulte o processo vinculado", "Planeje os próximos compromissos"].map((text, i) => <li key={text} className="flex items-center gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-300/40 text-sm text-amber-300">0{i + 1}</span><span className="text-slate-200">{text}</span></li>)}
              </ol>
              <a href="#demonstracao" onClick={() => trackFunnel("demo_view")} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-amber-300 hover:underline">Explore um exemplo <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
        <section id="recursos" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-800">Tudo conectado à sua rotina</p>
          <h2 className="mt-3 max-w-2xl text-3xl sm:text-4xl">Menos informações espalhadas.<br />Mais clareza para acompanhar.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => <article key={title} className="border-t-2 border-amber-600 pt-6"><Icon className="mb-4 text-slate-700" size={26} aria-hidden="true" /><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p></article>)}
          </div>
        </section>
        <section id="demonstracao" className="scroll-mt-6 border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-800">Conheça antes de começar</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Veja uma rotina organizada, passo a passo.</h2>
            <p className="mb-9 mt-4 max-w-2xl leading-relaxed text-slate-600">Selecione as etapas abaixo para explorar um exemplo com dados fictícios, sem precisar criar uma conta.</p>
            <ProductDemo />
            <div className="mt-8"><Button asChild size="lg"><Link to="/login?modo=cadastro" onClick={signup("demo")}>Começar meu cadastro <ArrowRight size={18} aria-hidden="true" /></Link></Button></div>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-sm font-semibold uppercase tracking-widest text-amber-800">Dúvidas frequentes</p><h2 className="mt-3 text-3xl">Antes de criar sua conta</h2></div>
          <div className="space-y-3">
            {[
              ["Para quem é o PrevFluxo?", "Para advogados e escritórios que precisam organizar clientes, processos, petições e compromissos em uma mesma rotina."],
              ["Preciso me cadastrar para ver a demonstração?", "Não. O exemplo acima é público e usa dados fictícios. Para acessar seus próprios registros, crie uma conta e faça login."],
              ["O que preciso para criar minha conta?", "Nome, número da OAB, e-mail e senha. Você pode completar a especialidade e os demais dados profissionais no perfil depois."],
              ["O sistema substitui a consulta aos tribunais?", "A apresentação mostra a organização dos registros do escritório. Não há promessa de consulta automática aos tribunais ou de acompanhamento automático de prazos."],
            ].map(([question, answer]) => <details key={question} className="rounded-xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-4 text-sm leading-relaxed text-slate-600">{answer}</p></details>)}
          </div>
        </section>
        <section className="bg-[#172238] text-white"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center"><div><h2 className="text-3xl">Comece a organizar sua rotina.</h2><p className="mt-3 text-slate-300">Crie sua conta e reúna os registros do escritório.</p></div><Button asChild size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300"><Link to="/login?modo=cadastro" onClick={signup("footer")}>Criar minha conta <ArrowRight size={18} aria-hidden="true" /></Link></Button></div></section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-5 py-7 text-sm text-slate-600 sm:px-8"><p>© {new Date().getFullYear()} PrevFluxo · Gestão jurídica</p><Link to="/login" className="hover:underline">Já tenho conta</Link></footer>
    </div>
  );
}
