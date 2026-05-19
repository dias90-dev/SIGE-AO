import React, { useState } from 'react';
import { Wallet, Smartphone, Printer, Clock, CheckCircle2, Loader2, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const Finance: React.FC = () => {
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const simulatePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsPaid(true);
    }, 2000);
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'docs') => {
    setExporting(format);
    try {
      const res = await fetch(`/api/finance/export/${format}`);
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Erro ao exportar relatório.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="mb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Finanças Automáticas <Wallet className="text-amber-500" />
          </h2>
          <p className="text-sm text-slate-500">Conciliação bancária em tempo real e gestão de propinas.</p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50"
            title="Exportar PDF"
          >
            {exporting === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
            <span className="hidden lg:inline">PDF</span>
          </button>
          <button 
            onClick={() => handleExport('excel')}
            disabled={!!exporting}
            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50"
            title="Exportar Excel"
          >
            {exporting === 'excel' ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
            <span className="hidden lg:inline">EXCEL</span>
          </button>
          <button 
            onClick={() => handleExport('docs')}
            disabled={!!exporting}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50"
            title="Exportar Word"
          >
            {exporting === 'docs' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            <span className="hidden lg:inline">DOCS</span>
          </button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Aluno / ID</th>
                <th className="px-6 py-4">Mês</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className={cn(
                "transition-colors duration-500",
                isPaid ? "bg-emerald-50/30" : "bg-red-50/30"
              )}>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">João Kiala</p>
                  <p className="text-xs text-slate-400">ID: 2026-0089</p>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">Maio 2026</td>
                <td className={cn(
                  "px-6 py-4 font-bold",
                  isPaid ? "text-emerald-600" : "text-red-600"
                )}>
                  18.000 Kz
                </td>
                <td className="px-6 py-4">
                  {isPaid ? (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1">
                      <CheckCircle2 size={12} /> PAGO (Auto)
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1">
                      <Clock size={12} /> PENDENTE
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {isPaid ? (
                    <button className="text-blue-600 font-bold text-xs hover:underline flex items-center justify-end gap-1 w-full">
                      <Printer size={14} /> Ver Recibo
                    </button>
                  ) : (
                    <button 
                      onClick={simulatePayment}
                      disabled={isPaying}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-orange-700 transition flex items-center gap-2 ml-auto"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          A processar...
                        </>
                      ) : (
                        <>
                          <Smartphone size={14} />
                          Simular Pagamento MCX
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-8 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-4"
          >
            <CheckCircle2 size={32} />
            <div>
              <p className="font-bold text-sm">Pagamento Confirmado (API EMIS)</p>
              <p className="text-xs text-emerald-100">O recibo foi enviado ao encarregado.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Finance;
