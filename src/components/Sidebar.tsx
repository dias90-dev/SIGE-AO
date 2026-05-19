import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Wallet, 
  Folders, 
  Package, 
  Scale, 
  GraduationCap, 
  Users, 
  UserSquare2, 
  Users2, 
  Medal, 
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { View } from '@/src/types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Global', icon: LayoutDashboard, category: 'Administração' },
    { id: 'directoria', label: 'Directoria', icon: Briefcase, category: 'Administração' },
    { id: 'financeiro', label: 'Finanças Automáticas', icon: Wallet, category: 'Administração' },
    { id: 'documentos', label: 'Gestão Documental', icon: Folders, category: 'Administração', iconColor: 'text-emerald-500' },
    { id: 'patrimonio', label: 'Património & Logística', icon: Package, category: 'Administração', iconColor: 'text-purple-400' },
    { id: 'juridico', label: 'Área Jurídica & IA', icon: Scale, category: 'Administração' },
    
    { id: 'academico', label: 'Lançamento de Notas', icon: GraduationCap, category: 'Área Pedagógica', iconColor: 'text-blue-400' },
    
    { id: 'rh', label: 'Gestão de RH Completa', icon: Users, category: 'Gestão de Pessoal' },
    
    { id: 'encarregados', label: 'Gestão Encarregados', icon: Users2, category: 'Comunidade Escolar' },
    { id: 'estudantes', label: 'Ass. de Estudantes', icon: UserSquare2, category: 'Comunidade Escolar' },
    { id: 'honra', label: 'Quadro de Honra', icon: Medal, category: 'Comunidade Escolar', iconColor: 'text-amber-500' },
    
    { id: 'configuracoes', label: 'Configurações', icon: Settings, category: 'Sistema' },
  ];

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed inset-y-0 left-0 w-[280px] bg-[#0F172A] flex flex-col z-50 transition-transform duration-300 md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 md:hidden">
          <h2 className="text-white font-bold">SIGE ANGOLA</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar">
          {categories.map(category => (
            <div key={category} className="space-y-1">
              <p className="px-8 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {category}
              </p>
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id as View);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-8 py-3 text-sm font-semibold transition-all border-r-4",
                      currentView === item.id
                        ? "border-blue-500 text-blue-500 bg-slate-800"
                        : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <item.icon className={cn("size-5", item.iconColor)} />
                    {item.label}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        <div className="p-6 bg-slate-900 text-white flex items-center gap-3 shrink-0 border-t border-slate-800 cursor-pointer hover:bg-slate-800 mt-auto">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100" 
            alt="User profile"
            className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Dra. Nádia Costa</p>
            <p className="text-[10px] text-slate-400 uppercase">Direção Geral</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
