/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Academic from './components/Academic';
import Juridico from './components/Juridico';
import Finance from './components/Finance';
import Patrimonio from './components/Patrimonio';
import SettingsView from './components/SettingsView';
import Login from './components/Login';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { SettingsProvider } from './contexts/SettingsContext';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: number;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulate real-time notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotif: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          type: Math.random() > 0.5 ? 'success' : 'info',
          title: 'Sistema SIGE',
          message: Math.random() > 0.5 ? 'Novo pagamento de propina recebido.' : 'Pauta de Matemática atualizada.',
          timestamp: Date.now(),
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 5));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Fallback for missing views
  const renderPlaceholder = (title: string) => (
    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
      <div>
        <h2 className="text-3xl font-bold text-slate-300 mb-2">{title}</h2>
        <p className="text-slate-400">Este módulo está em desenvolvimento para o SIGE Angola.</p>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'academico': return <Academic />;
      case 'juridico': return <Juridico />;
      case 'financeiro': return <Finance />;
      case 'patrimonio': return <Patrimonio />;
      case 'configuracoes': return <SettingsView />;
      case 'directoria': return renderPlaceholder('Painel da Directoria');
      case 'rh': return renderPlaceholder('Gestão de RH 360');
      case 'documentos': return renderPlaceholder('Gestão Documental');
      case 'quem-somos': return renderPlaceholder('Institucional: Quem Somos');
      case 'servicos': return renderPlaceholder('Institucional: Nossos Serviços');
      case 'contato': return renderPlaceholder('Institucional: Contatos');
      default: return <Dashboard />;
    }
  };

  return (
    <SettingsProvider>
      <div className="flex flex-col h-screen bg-[#F8FAFC] text-slate-800 font-['Inter',_sans-serif]">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar 
            currentView={currentView} 
            onNavigate={setCurrentView} 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Real-time Notifications Toast Pool */}
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 max-w-sm w-full">
          <AnimatePresence>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                className={cn(
                  "p-4 rounded-xl shadow-2xl border flex gap-4 bg-white",
                  n.type === 'success' ? "border-emerald-100" : "border-blue-100"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  n.type === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                  {n.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800">{n.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                </div>
                <button 
                  onClick={() => removeNotification(n.id)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </SettingsProvider>
  );
}
