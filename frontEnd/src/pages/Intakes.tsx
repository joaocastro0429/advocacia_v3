import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClipboardList, Plus, CalendarDays } from 'lucide-react';

interface Intake { id: string; title: string; category: string; notes: string; status: string; items: {id: string; title: string; received: boolean}[]; tasks: {id: string; title: string; dueDate: string | null; done: boolean}[] }
const statuses = {triagem: 'Triagem', documentos: 'Aguardando documentos', analise: 'Em análise', concluido: 'Concluído'};

export default function Intakes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const key = ['intakes', user?.id];
  const { data = [], isLoading, error } = useQuery({ queryKey: key, queryFn: () => apiClient.get<Intake[]>('/intakes') });
  const selected = data.find(item => item.id === selectedId);
  const mutation = useMutation({ mutationFn: ({path, body, method}: {path: string; body: unknown; method: 'post' | 'put'}) => apiClient[method](path, body), onSuccess: () => queryClient.invalidateQueries({queryKey: key}), onError: (error: Error) => toast({title: 'Não foi possível salvar', description: error.message, variant: 'destructive'}) });
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-3xl font-bold text-slate-900">Atendimentos</h1><p className="text-slate-500 mt-1">Organize a triagem, os documentos e os próximos passos.</p></div>
      <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className="bg-[#1e293b] text-[#fbbf24] hover:bg-slate-800"><Plus className="mr-2 h-4 w-4"/>Novo atendimento</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Novo atendimento</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={async event => {event.preventDefault(); const form = new FormData(event.currentTarget); try {await mutation.mutateAsync({path:'/intakes',method:'post',body:Object.fromEntries(form)});setOpen(false);} catch { /* shown by mutation */ }}}>
          <div className="space-y-2"><Label htmlFor="intake-title">Cliente / nome do atendimento</Label><Input id="intake-title" name="title" required maxLength={200}/></div>
          <div className="space-y-2"><Label htmlFor="intake-category">Tipo de atendimento</Label><select id="intake-category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option>Aposentadoria</option><option>Benefício por incapacidade</option><option>BPC / LOAS</option><option>Pensão por morte</option><option>Outro</option></select></div>
          <div className="space-y-2"><Label htmlFor="intake-notes">Observações</Label><Textarea id="intake-notes" name="notes"/></div><Button disabled={mutation.isPending} type="submit">Salvar atendimento</Button>
        </form></DialogContent></Dialog>
    </div>
    {isLoading && <p role="status">Carregando atendimentos…</p>}{error && <p role="alert" className="text-red-600">Não foi possível carregar os atendimentos. Tente novamente.</p>}
    {!isLoading && !error && data.length === 0 && <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"><ClipboardList className="mx-auto h-10 w-10 text-slate-400"/><h2 className="font-serif text-xl mt-4">Seu primeiro atendimento começa aqui</h2><p className="text-slate-500 mt-2">Cadastre um cliente em triagem e acompanhe as pendências antes do processo.</p></div>}
    <div className="grid gap-6 lg:grid-cols-2"><div className="space-y-3">{data.map(item => <button key={item.id} onClick={() => {setSelectedId(item.id);setTaskTitle('');setDueDate('');}} className={`w-full text-left bg-white rounded-xl shadow-sm border p-5 ${selectedId === item.id ? 'border-amber-400' : 'border-slate-100'}`}><div className="flex justify-between gap-3"><h2 className="font-serif text-xl text-slate-900">{item.title}</h2><span className="text-xs rounded-full bg-slate-100 px-3 py-1 self-start">{statuses[item.status]}</span></div><p className="text-sm text-slate-500 mt-2">{item.category}</p><p className="text-sm text-slate-500 mt-3">{item.items.filter(i => i.received).length}/{item.items.length} documentos · {item.tasks.filter(t => !t.done).length} tarefas pendentes</p></button>)}</div>
      {selected && <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6"><h2 className="font-serif text-2xl">{selected.title}</h2><Label htmlFor="intake-status">Etapa do atendimento</Label><select id="intake-status" value={selected.status} disabled={mutation.isPending} onChange={e => mutation.mutate({path:`/intakes/${selected.id}`,method:'put',body:{status:e.target.value}})} className="h-10 w-full rounded-md border border-input bg-background px-3">{Object.entries(statuses).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select>{selected.notes && <p className="text-sm text-slate-600 whitespace-pre-wrap">{selected.notes}</p>}
        <div><h3 className="font-semibold mb-3">Checklist de documentos</h3><div className="space-y-3">{selected.items.map(item => <label key={item.id} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={item.received} disabled={mutation.isPending} onChange={e => mutation.mutate({path:`/intakes/${selected.id}/items/${item.id}`,method:'put',body:{received:e.target.checked}})}/>{item.title}</label>)}</div></div>
        <div><h3 className="font-semibold mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4"/>Tarefas e prazos</h3><div className="space-y-3">{selected.tasks.map(task => <label key={task.id} className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={task.done} disabled={mutation.isPending} onChange={e => mutation.mutate({path:`/intakes/${selected.id}/tasks/${task.id}`,method:'put',body:{done:e.target.checked}})}/><span className={task.done ? 'line-through text-slate-400' : ''}>{task.title}{task.dueDate && <small className="block text-slate-500">Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</small>}</span></label>)}</div>
          <form className="mt-4 space-y-3" onSubmit={async e => {e.preventDefault();try {await mutation.mutateAsync({path:`/intakes/${selected.id}/tasks`,method:'post',body:{title:taskTitle,dueDate:dueDate || null}});setTaskTitle('');setDueDate('');} catch { /* shown by mutation */ }}}><Label htmlFor="task-title">Nova tarefa</Label><Input id="task-title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required maxLength={200}/><Label htmlFor="task-date">Prazo (opcional)</Label><Input id="task-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}/><Button type="submit" disabled={mutation.isPending}>Adicionar tarefa</Button></form>
        </div>
      </section>}
    </div>
  </div>;
}
