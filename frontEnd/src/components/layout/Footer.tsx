export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-6 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Lado Esquerdo: Copyright */}
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} <span className="font-bold text-slate-900 uppercase">PrevFluxo</span>.
          Todos os direitos reservados.
        </div>

        {/* Lado Direito: Info e Status */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-slate-600">Sistema Online</span>
          </div>
          <span className="text-slate-300">|</span>
          <a href="https://wa.me/5562982454512" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#d99117] transition-colors">
            Suporte: (62) 98245-4512
          </a>
          <span className="text-slate-300">|</span>
          <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-mono text-slate-400">
            v1.0.0
          </span>
        </div>

      </div>
    </footer>
  );
}
