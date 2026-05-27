import React from 'react';
import { Menu, GraduationCap, Building2, ChevronDown, PlusCircle, Bell } from 'lucide-react';
import { View } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { useSettings } from '../contexts/SettingsContext';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onToggleSidebar }) => {
  const { info } = useSettings();
  const topNavItems = [
    { id: 'quem-somos', label: 'Quem Somos' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'sistema', label: 'Sistema (ERP)' },
    { id: 'contato', label: 'Contato' },
  ];

  // Determine if we are in "System" mode or "Institutional" mode
  const isSystemMode = ![ 'quem-somos', 'servicos', 'contato'].includes(currentView);

  return (
    <header className="bg-[#0B1120] text-white flex-shrink-0 h-20 flex items-center justify-between px-6 md:px-8 shadow-xl relative z-50 border-b border-slate-800">
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden text-white text-2xl hover:text-blue-500"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1 rounded-lg hidden md:flex items-center justify-center overflow-hidden w-10 h-10">
            {info?.logo ? (
              <img src={info.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <GraduationCap size={20} className="text-white" />
            )}
          </div>
          <h1 className="font-bold text-lg md:text-xl tracking-wider">
            {(info?.name || "SIGE").includes("SIGE") ? (
              <>SIGE <span className="text-blue-500">ANGOLA</span></>
            ) : (
              info?.name || "SIGE ANGOLA"
            )}
          </h1>
        </div>

        {/* Polo Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 ml-4">
          <Building2 size={16} className="text-slate-400" />
          <select className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer appearance-none">
            <option>Polo Principal (Luanda)</option>
            <option>Polo Talatona</option>
            <option>Polo Benfica</option>
            <option>Polo Viana</option>
            <option>Polo Cacuaco</option>
            <option>Polo Kilamba</option>
            <option>Polo Lobito</option>
            <option>Polo Huambo</option>
          </select>
          <ChevronDown size={10} className="text-slate-400" />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <nav className="hidden xl:flex space-x-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700 mr-4">
          {topNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'sistema') {
                  onViewChange('dashboard');
                } else {
                  onViewChange(item.id as View);
                }
              }}
              className={cn(
                "px-4 py-1.5 rounded-md font-semibold text-xs transition-all",
                (item.id === 'sistema' && isSystemMode) || currentView === item.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 border-l border-slate-700 pl-4">
          <button className="text-slate-300 hover:text-white transition" title="Acções Rápidas">
            <PlusCircle size={20} />
          </button>
          <button className="relative text-slate-300 hover:text-white transition">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-[#0B1120]"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
