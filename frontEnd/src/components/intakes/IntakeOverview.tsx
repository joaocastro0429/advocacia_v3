import { Link } from 'react-router-dom';
import { ClipboardList, FileText, AlertCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { useIntakeSummary, formatIntakeDate } from '@/hooks/useIntakes';
import { Button } from '@/components/ui/button';

export function IntakeOverview() {
  const {data,isLoading,error,refetch} = useIntakeSummary();
  if (isLoading) return <p role="status" className="text-sm text-slate-600">Carregando pendências dos atendimentos…</p>;
  if (error || !data) return <div role="alert" className="rounded-xl bg-white border p-4">Não foi possível carregar as pendências. <Button variant="outline" onClick={()=>refetch()}>Tentar novamente</Button></div>;
  const link = (id:string) => `/atendimentos?id=${encodeURIComponent(id)}`;
  return <section className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl text-slate-900">Rotina previdenciária</h2><Button asChild className="bg-[#1e293b] text-[#fbbf24] hover:bg-slate-800"><Link to="/atendimentos">Ver atendimentos</Link></Button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Atendimentos em aberto" value={data.active} icon={ClipboardList} variant="accent"/>
      <StatCard title="Documentos pendentes" value={data.pendingDocuments} subtitle="Nos atendimentos em aberto" icon={FileText} variant="accent"/>
      <StatCard title="Tarefas vencidas" value={data.overdueTasks} subtitle="Pendentes com prazo anterior a hoje" icon={AlertCircle} variant="accent"/>
      <StatCard title="Sem movimentação" value={data.stalledCount} subtitle="Há 7 dias ou mais" icon={Clock} variant="accent"/>
    </div>
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-5"><h3 className="font-serif text-lg mb-3">Tarefas que precisam de atenção</h3>{!data.overdue.length && <p className="text-sm text-slate-600">Nenhuma tarefa vencida.</p>}<ul className="space-y-3">{data.overdue.slice(0,5).map((t,index)=><li className="rounded-lg border border-red-200 bg-red-50 p-3" key={`${t.intakeId}-${index}`}><Link className="text-sm hover:underline" to={link(t.intakeId)}>{t.title}<span className="block text-xs text-slate-600">{t.intakeTitle}</span><span className="block text-xs text-red-700 font-semibold">Prazo: {formatIntakeDate(t.dueDate)}</span></Link></li>)}</ul></div>
      <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-5"><h3 className="font-serif text-lg mb-3">Exigências: hoje ou vencidas</h3>{!data.requirements.length && <p className="text-sm text-slate-600">Nenhum prazo de exigência para hoje ou vencido.</p>}<ul className="space-y-3">{data.requirements.slice(0,5).map(i=><li className="rounded-lg border border-red-200 bg-red-50 p-3" key={i.id}><Link className="text-sm hover:underline" to={link(i.id)}>{i.title}<span className="block text-xs text-red-700 font-semibold">Prazo: {formatIntakeDate(i.dueDate)}</span></Link></li>)}</ul></div>
      <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-5"><h3 className="font-serif text-lg mb-3">Atendimentos sem movimentação</h3>{!data.stalled.length && <p className="text-sm text-slate-600">Nenhum atendimento parado há 7 dias.</p>}<ul className="space-y-3">{data.stalled.slice(0,5).map(i=><li key={i.id}><Link className="text-sm hover:underline" to={link(i.id)}>{i.title}<span className="block text-xs text-slate-600">Última atividade: {formatIntakeDate(i.lastActivityAt)}</span></Link></li>)}</ul></div>
    </div>
  </section>;
}
