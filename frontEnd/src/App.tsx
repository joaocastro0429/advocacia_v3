import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
const Clients = lazy(() => import("./pages/Clients"));
const Cases = lazy(() => import("./pages/Cases"));
const Agenda = lazy(() => import("./pages/Agenda"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Petitions = lazy(() => import("./pages/Petitions"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Lawyers = lazy(() => import("./pages/Lawyers"));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }}>
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center" role="status">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route element={
              <ProtectedRoute>
                <DashboardLayout /> 
              </ProtectedRoute>
            }>
              <Route path="/clientes" element={<Clients />} />
              <Route path="/processos" element={<Cases />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/notificacoes" element={<Notifications />} />
              <Route path="/petitions" element={<Petitions />} /> {/* Updated route path */}
              <Route path="/advogados" element={<Lawyers />} /> 
              <Route path="/perfil" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
