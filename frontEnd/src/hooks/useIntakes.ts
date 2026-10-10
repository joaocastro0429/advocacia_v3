import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
export interface Intake {
  id: string; title: string; category: string; notes: string; status: string;
  clientId: string | null; client: {id: string; name: string} | null;
  protocol: string; benefitNumber: string; requestedAt: string | null; requirementDueAt: string | null; lastActivityAt: string;
  items: {id: string; title: string; received: boolean; file: {id: string; name: string} | null}[];
  tasks: {id: string; title: string; dueDate: string | null; done: boolean}[];
}
export interface IntakeSummary {
  active: number; pendingDocuments: number; overdueTasks: number; stalledCount: number;
  overdue: {intakeId: string; intakeTitle: string; title: string; dueDate: string}[];
  requirements: {id: string; title: string; dueDate: string}[];
  stalled: {id: string; title: string; lastActivityAt: string}[];
}
export const intakeStatuses: Record<string,string> = {triagem:'Triagem',documentos:'Aguardando documentos',analise:'Em análise',protocolado:'Protocolado no INSS',exigencia:'Em exigência',pericia:'Aguardando perícia',deferido:'Deferido',indeferido:'Indeferido',recurso:'Em recurso',concluido:'Concluído'};
export const formatIntakeDate = (date: string) => new Date(date).toLocaleDateString('pt-BR',{timeZone:'UTC'});
export const todayInBrazil = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date());
export function useIntakes() {
  const {user} = useAuth();
  return useQuery({queryKey:['intakes',user?.id],queryFn:()=>apiClient.get<Intake[]>('/intakes'),enabled:!!user?.id});
}
export function useIntakeSummary() {
  const {user} = useAuth();
  return useQuery({queryKey:['intake-summary',user?.id,todayInBrazil()],queryFn:()=>apiClient.get<IntakeSummary>('/intakes/summary'),enabled:!!user?.id,refetchInterval:60000});
}
