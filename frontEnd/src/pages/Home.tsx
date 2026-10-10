import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { lazy, Suspense } from "react";
import Landing from "./Landing";

const Index = lazy(() => import("./Index"));

export default function Home() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center" role="status">Carregando...</div>;
  return isAuthenticated ? <DashboardLayout><Suspense fallback={<p role="status">Carregando painel...</p>}><Index /></Suspense></DashboardLayout> : <Landing />;
}
