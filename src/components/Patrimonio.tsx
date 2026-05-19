import React from 'react';
import { Package, Monitor, Sofa, Bus, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const Patrimonio: React.FC = () => {
  const sections = [
    { 
      title: 'Laboratório de TI', 
      icon: Monitor, 
      color: 'border-t-blue-500', 
      iconColor: 'text-blue-500',
      items: [
        { label: 'Computadores Desktop', value: '45 uni.' },
        { label: 'Projetores EPSON', value: '12 uni.' },
        { label: 'Estado Manutenção', value: 'Em Dia', status: 'success' },
      ]
    },
    { 
      title: 'Salas de Aula', 
      icon: Sofa, 
      color: 'border-t-amber-500', 
      iconColor: 'text-amber-500',
      items: [
        { label: 'Carteiras Duplas', value: '850 uni.' },
        { label: 'Quadros Brancos', value: '42 uni.' },
        { label: 'Reparação Necessária', value: '15 Carteiras', status: 'error' },
      ]
    },
    { 
      title: 'Frota (Transporte)', 
      icon: Bus, 
      color: 'border-t-purple-500', 
      iconColor: 'text-purple-500',
      items: [
        { label: 'Autocarros (50 Lugares)', value: '3 uni.' },
        { label: 'Mini-Bus (Coaster)', value: '2 uni.' },
        { label: 'Inspeção e Seguros', value: 'Válidos', status: 'success' },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-purple-600" />
            Gestão de Património
          </h2>
          <p className="text-sm text-slate-500">Controlo de imobilizado, logística e inventário escolar.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow flex items-center gap-2 transition-colors">
          <Plus size={18} /> Novo Registo
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-t-4",
              section.color
            )}
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <section.icon className={section.iconColor} size={20} />
              {section.title}
            </h3>
            <ul className="space-y-3 text-sm">
              {section.items.map((item, j) => (
                <li key={j} className="flex justify-between items-center">
                  <span className="text-slate-500">{item.label}</span>
                  {item.status ? (
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1",
                      item.status === 'success' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {item.status === 'success' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                      {item.value}
                    </span>
                  ) : (
                    <span className="font-bold text-slate-800">{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Patrimonio;
