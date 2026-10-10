import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { apiClient, API_BASE_URL } from '@/lib/api-client';
import { downloadProtectedFile } from '@/lib/file-download';
import { useClients } from '@/hooks/useClients';
import { useIntakes, Intake, intakeStatuses, formatIntakeDate, todayInBrazil } from '@/hooks/useIntakes';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Plus, CalendarDays, Download } from 'lucide-react';
const selectClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm';
const buttonClass = 'bg-[#1e293b] text-[#fbbf24] hover:bg-slate-800';

export default function Intakes() {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  const [params,setParams] = useSearchParams();
  const {clients, isLoading: clientsLoading, error: clientsError} = useClients();
  const {data = [],isLoading,error} = useIntakes();
  const [open,setOpen] = useState(false);
  const [editing,setEditing] = useState(false);
  const [search,setSearch] = useState('');
  const [taskTitle,setTaskTitle] = useState('');
  const [dueDate,setDueDate] = useState('');
  const [documentTitle,setDocumentTitle] = useState('');
  const [activeTab,setActiveTab] = useState('documentos');
  const selected = data.find(i=>i.id === params.get('id'));
  const clientFilter = params.get('clientId');
  const visible = data.filter(i=>(!clientFilter || i.clientId === clientFilter) && `${i.title} ${i.client?.name || ''} ${i.protocol} ${i.category}`.toLowerCase().includes(search.toLowerCase()));
  const refresh = async () => {await Promise.all([queryClient.invalidateQueries({queryKey:['intakes']}),queryClient.invalidateQueries({queryKey:['intake-summary']})]);};
  const mutation = useMutation({mutationFn:({path,body,method}:{path:string;body:unknown;method:'post'|'put'})=>apiClient[method](path,body),onSuccess:refresh,onError:(e:Error)=>toast({title:'Não foi possível salvar',description:e.message,variant:'destructive'})});
  const upload = useMutation({mutationFn:async ({itemId,file}:{itemId:string;file:File})=>{
    if (file.size > 3*1024*1024) throw new Error('O arquivo deve ter até 3 MB.');
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
    const body = new FormData(); body.append('file',file);
    const response = await fetch(`${API_BASE_URL}/intakes/${selected!.id}/items/${itemId}/file`,{method:'POST',headers:{Authorization:`Bearer ${token}`},body});
    if (!response.ok) {const result = await response.json().catch(()=>({message:'Falha no envio.'}));throw new Error(result.message || 'Falha no envio.');}
  },onSuccess:async()=>{await refresh();toast({title:'Documento anexado ao atendimento'});},onError:(e:Error)=>toast({title:'Não foi possível enviar',description:e.message,variant:'destructive'})});
  const busy = mutation.isPending || upload.isPending;
  const choose = (id:string) => {setParams(p=>{p.set('id',id);return p;});setTaskTitle('');setDueDate('');setDocumentTitle('');setActiveTab('documentos');};
  const clientSelect = (defaultId = '') => <div className="space-y-2"><Label htmlFor="intake-client">Cliente vinculado</Label><select id="intake-client" name="clientId" defaultValue={defaultId} className={selectClass} disabled={clientsLoading || !!clientsError}><option value="">Sem vínculo — triagem inicial</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>{clientsError && <p role="alert" className="text-sm text-red-700 font-semibold">Não foi possível carregar os clientes.</p>}<p className="text-xs text-slate-600">Cadastre o cliente em <Link className="underline" to="/clientes">Clientes</Link> para reunir seus atendimentos.</p></div>;
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-3xl font-bold text-slate-900">Atendimentos</h1><p className="text-slate-600 mt-1">Da triagem ao requerimento: clientes, documentos e próximos passos.</p></div>
      <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button className={buttonClass}><Plus className="mr-2 h-4 w-4"/>Novo atendimento</Button></DialogTrigger><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Novo atendimento</DialogTitle><DialogDescription>Vincule um cliente e organize a documentação inicial.</DialogDescription></DialogHeader>
        <form className="space-y-4" onSubmit={async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(e.currentTarget));try{const item=await mutation.mutateAsync({path:'/intakes',method:'post',body}) as Intake;setOpen(false);choose(item.id);}catch{/* toast */}}}>
          <div className="space-y-2"><Label htmlFor="intake-title">Nome do atendimento</Label><Input id="intake-title" name="title" required maxLength={200}/></div>
          {clientSelect(clientFilter || '')}
          <div className="space-y-2"><Label htmlFor="intake-category">Tipo de atendimento</Label><select id="intake-category" name="category" className={selectClass}><option>Aposentadoria</option><option>Benefício por incapacidade</option><option>BPC / LOAS</option><option>Pensão por morte</option><option>Outro</option></select></div>
          <div className="space-y-2"><Label htmlFor="intake-notes">Observações</Label><Textarea id="intake-notes" name="notes" maxLength={10000}/></div><Button className={buttonClass} disabled={busy} type="submit">Salvar atendimento</Button>
        </form></DialogContent></Dialog>
    </div>
    <Input aria-label="Buscar atendimentos" placeholder="Buscar por cliente, atendimento ou protocolo..." value={search} onChange={e=>setSearch(e.target.value)} className="max-w-md bg-white"/>
    {clientFilter && <div className="flex items-center gap-3 text-sm"><span>Atendimentos de {clients.find(c=>c.id===clientFilter)?.name || 'cliente selecionado'}</span><Button variant="outline" onClick={()=>setParams(p=>{p.delete('clientId');return p;})}>Ver todos</Button></div>}
    {isLoading && <p role="status">Carregando atendimentos…</p>}{error && <p role="alert" className="text-red-700 font-semibold">Não foi possível carregar os atendimentos.</p>}
    {!isLoading && !error && !visible.length && <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center"><ClipboardList className="mx-auto h-10 w-10 text-slate-500"/><h2 className="font-serif text-xl mt-4">Nenhum atendimento encontrado</h2><p className="text-slate-600 mt-2">Cadastre um atendimento ou ajuste a busca.</p></div>}
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]"><div className={`space-y-3 ${selected ? 'hidden xl:block' : ''}`}>{visible.map(item=><button key={item.id} onClick={()=>choose(item.id)} className={`w-full text-left break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 bg-white rounded-xl shadow-sm border p-5 ${selected?.id===item.id?'border-amber-400':'border-slate-100'}`}><div className="flex flex-wrap justify-between gap-3"><h2 className="font-serif text-xl text-slate-900">{item.title}</h2><span className="text-xs rounded-full bg-slate-100 px-3 py-1 self-start">{intakeStatuses[item.status] || item.status}</span></div><p className="text-sm text-slate-600 mt-2">{item.category}{item.client && ` · ${item.client.name}`}</p><p className="text-sm text-slate-600 mt-3">{item.items.filter(i=>i.received).length}/{item.items.length} documentos · {item.tasks.filter(t=>!t.done).length} tarefas pendentes</p></button>)}</div>
      {selected && <section className="min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5"><div className="flex flex-wrap justify-between gap-3"><div className="min-w-0"><Button variant="ghost" size="sm" className="xl:hidden mb-2" onClick={()=>setParams(p=>{p.delete('id');return p;})}>← Voltar à lista</Button><h2 className="font-serif text-2xl break-words">{selected.title}</h2><p className="text-sm text-slate-600 mt-1">{selected.client?.name || 'Cliente ainda não vinculado'}</p></div><Button variant="outline" onClick={()=>setEditing(true)}>Editar dados</Button></div>
        <div className="space-y-2"><Label htmlFor="intake-status">Etapa do atendimento</Label><select id="intake-status" value={selected.status} disabled={busy} onChange={e=>mutation.mutate({path:`/intakes/${selected.id}`,method:'put',body:{status:e.target.value}})} className={selectClass}>{Object.entries(intakeStatuses).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList aria-label="Seções do atendimento" className="grid h-auto min-h-11 w-full grid-cols-3 bg-slate-100">
            <TabsTrigger className="px-1 sm:px-3" value="documentos">Documentos ({selected.items.filter(i=>!i.received).length})</TabsTrigger>
            <TabsTrigger className="px-1 sm:px-3" value="tarefas">Tarefas ({selected.tasks.filter(t=>!t.done).length})</TabsTrigger>
            <TabsTrigger className="px-1 sm:px-3" value="inss">Dados INSS</TabsTrigger>
          </TabsList>
          <TabsContent value="inss" className="pt-4 space-y-4">
        <div className="rounded-lg bg-slate-50 p-4 text-sm grid sm:grid-cols-2 gap-3"><p><span className="block text-slate-600">Protocolo INSS</span>{selected.protocol || 'Não informado'}</p><p><span className="block text-slate-600">Número do benefício (NB)</span>{selected.benefitNumber || 'Não informado'}</p><p><span className="block text-slate-600">Data do requerimento (DER)</span>{selected.requestedAt ? formatIntakeDate(selected.requestedAt):'Não informada'}</p><p className={selected.requirementDueAt && selected.requirementDueAt.slice(0,10)<=todayInBrazil() ? "rounded-md border border-red-200 bg-red-50 p-2 text-red-800 font-semibold" : ""}><span className="block text-slate-600">Prazo de exigência</span>{selected.requirementDueAt ? formatIntakeDate(selected.requirementDueAt):'Não informado'}</p></div>
        {selected.notes && <p className="text-sm text-slate-600 whitespace-pre-wrap">{selected.notes}</p>}
          </TabsContent>
          <TabsContent value="documentos" className="pt-4">
        <div><h3 className="font-semibold mb-2">Checklist de documentos</h3><p className="text-xs text-slate-600 mb-4">Marque como recebido quando já tiver o documento. Anexar um arquivo também marca o item como recebido. PDF, PNG ou JPEG até 3 MB.</p><div className="space-y-4">{selected.items.map(item=><div key={item.id} className="rounded-lg border border-slate-200 p-3 sm:p-4"><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={item.received} disabled={busy} onChange={e=>mutation.mutate({path:`/intakes/${selected.id}/items/${item.id}`,method:'put',body:{received:e.target.checked}})}/><span className="min-w-0 break-words font-medium">{item.title}</span></label><div className="mt-2 flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.received ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>{item.received ? 'Recebido' : 'Pendente'}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{item.file ? 'Arquivo anexado' : 'Sem arquivo anexado'}</span></div>{item.file && <Button className="mt-2 max-w-full" variant="ghost" size="sm" onClick={async()=>{try{await downloadProtectedFile(`/files/${item.file!.id}`,item.file!.name);}catch(e){toast({title:'Falha no download',description:(e as Error).message,variant:'destructive'});}}}><Download className="h-4 w-4 mr-2 shrink-0"/><span className="truncate">{item.file.name}</span></Button>}<Label htmlFor={`file-${item.id}`} className="block text-xs text-slate-600 mt-2">{item.file?'Substituir anexo':'Anexar documento'}</Label><Input id={`file-${item.id}`} type="file" accept=".pdf,.png,.jpg,.jpeg" disabled={busy} onChange={e=>{const file=e.target.files?.[0];if(file)upload.mutate({itemId:item.id,file});e.target.value='';}} className="mt-1 h-auto min-h-11 py-2 text-sm file:mr-2 file:rounded file:bg-slate-100 file:px-2 file:py-1 file:text-slate-800"/></div>)}</div>
          <form className="mt-4 space-y-2" onSubmit={async e=>{e.preventDefault();try{await mutation.mutateAsync({path:`/intakes/${selected.id}/items`,method:'post',body:{title:documentTitle}});setDocumentTitle('');}catch{/* toast */}}}><Label htmlFor="document-title">Adicionar documento ao checklist</Label><Input id="document-title" value={documentTitle} onChange={e=>setDocumentTitle(e.target.value)} required maxLength={200}/><Button variant="outline" type="submit" disabled={busy}>Adicionar documento</Button></form>
        </div>
          </TabsContent><TabsContent value="tarefas" className="pt-4">
        <div><h3 className="font-semibold mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4"/>Tarefas e prazos</h3>{!selected.tasks.length && <p className="text-sm text-slate-600 mb-3">Nenhuma tarefa cadastrada. Adicione o próximo passo abaixo.</p>}<div className="space-y-3">{selected.tasks.map(task=><label key={task.id} className={`flex items-start gap-3 rounded-lg border p-3 text-sm ${!task.done && task.dueDate && task.dueDate.slice(0,10)<todayInBrazil() ? 'border-red-200 bg-red-50' : 'border-slate-200'}`}><input className="mt-1" type="checkbox" checked={task.done} disabled={busy} onChange={e=>mutation.mutate({path:`/intakes/${selected.id}/tasks/${task.id}`,method:'put',body:{done:e.target.checked}})}/><span className={task.done?'line-through text-slate-500':''}>{task.title}{task.dueDate && <small className={`block ${!task.done && task.dueDate.slice(0,10)<todayInBrazil()?'text-red-700 font-semibold':'text-slate-600'}`}>Prazo: {formatIntakeDate(task.dueDate)}{!task.done && task.dueDate.slice(0,10)<todayInBrazil()?' · Vencida':''}</small>}</span></label>)}</div>
          <form className="mt-4 space-y-3" onSubmit={async e=>{e.preventDefault();try{await mutation.mutateAsync({path:`/intakes/${selected.id}/tasks`,method:'post',body:{title:taskTitle,dueDate:dueDate || null}});setTaskTitle('');setDueDate('');}catch{/* toast */}}}><Label htmlFor="task-title">Nova tarefa</Label><Input id="task-title" value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} required maxLength={200}/><Label htmlFor="task-date">Prazo (opcional)</Label><Input id="task-date" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}/><Button className={buttonClass} type="submit" disabled={busy}>Adicionar tarefa</Button></form>
        </div>
          </TabsContent></Tabs>
        <Dialog open={editing} onOpenChange={setEditing}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Dados do atendimento</DialogTitle><DialogDescription>Registre as informações do requerimento e os prazos informados pelo INSS.</DialogDescription></DialogHeader><form key={selected.id} className="space-y-4" onSubmit={async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(e.currentTarget));if(clientsLoading || clientsError)delete body.clientId;try{await mutation.mutateAsync({path:`/intakes/${selected.id}`,method:'put',body});setEditing(false);}catch{/* toast */}}}>
          <Label htmlFor="edit-title">Nome do atendimento</Label><Input id="edit-title" name="title" defaultValue={selected.title} required maxLength={200}/>{clientSelect(selected.clientId || '')}
          <Label htmlFor="protocol">Protocolo INSS</Label><Input id="protocol" name="protocol" defaultValue={selected.protocol} maxLength={200}/><Label htmlFor="benefit-number">Número do benefício (NB)</Label><Input id="benefit-number" name="benefitNumber" defaultValue={selected.benefitNumber} maxLength={200}/>
          <Label htmlFor="requested-at">Data do requerimento (DER)</Label><Input id="requested-at" name="requestedAt" type="date" defaultValue={selected.requestedAt?.slice(0,10) || ''}/><Label htmlFor="requirement-due">Prazo de exigência</Label><Input id="requirement-due" name="requirementDueAt" type="date" defaultValue={selected.requirementDueAt?.slice(0,10) || ''}/>
          <Label htmlFor="edit-notes">Observações</Label><Textarea id="edit-notes" name="notes" defaultValue={selected.notes} maxLength={10000}/><Button className={buttonClass} disabled={busy} type="submit">Salvar dados</Button>
        </form></DialogContent></Dialog>
      </section>}
    </div>
  </div>;
}
