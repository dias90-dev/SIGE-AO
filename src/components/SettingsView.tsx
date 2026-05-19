import React, { useState, useRef } from 'react';
import { Settings, School, MapPin, Phone, Mail, Globe, Save, Loader2, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useSettings } from '../contexts/SettingsContext';

const SettingsView: React.FC = () => {
  const { info, updateInfo } = useSettings();
  const [localInfo, setLocalInfo] = useState(info);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem deve ser menor que 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalInfo(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateInfo(localInfo);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-slate-600" />
            Configurações do Sistema
          </h2>
          <p className="text-sm text-slate-500">Gerencie as informações da sua instituição e parâmetros do sistema.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-center p-8">
            <div className="relative group mx-auto mb-4 w-32 h-32">
              <div className="w-full h-full bg-blue-100 rounded-2xl flex items-center justify-center border-2 border-blue-50 overflow-hidden">
                {localInfo.logo ? (
                  <img src={localInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <School className="text-blue-600 size-12" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              >
                <Upload size={24} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </div>
            
            {localInfo.logo && (
              <button 
                onClick={() => setLocalInfo({ ...localInfo, logo: null })}
                className="text-xs text-red-500 font-bold hover:underline flex items-center justify-center gap-1 mx-auto mb-4"
              >
                <Trash2 size={12} /> Remover Logotipo
              </button>
            )}

            <h3 className="font-bold text-slate-800 text-lg">{localInfo.name}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">NIF: {localInfo.taxId}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-sm text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{localInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>{localInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{localInfo.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome da Instituição</label>
                <input 
                  type="text" 
                  value={localInfo.name}
                  onChange={e => setLocalInfo({ ...localInfo, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">NIF (Identificação Fiscal)</label>
                <input 
                  type="text" 
                  value={localInfo.taxId}
                  onChange={e => setLocalInfo({ ...localInfo, taxId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Endereço Completo</label>
                <input 
                  type="text" 
                  value={localInfo.address}
                  onChange={e => setLocalInfo({ ...localInfo, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contacto Telefónico</label>
                <input 
                  type="text" 
                  value={localInfo.phone}
                  onChange={e => setLocalInfo({ ...localInfo, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail de Contacto</label>
                <input 
                  type="email" 
                  value={localInfo.email}
                  onChange={e => setLocalInfo({ ...localInfo, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {saved && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald-500 text-sm font-bold flex items-center gap-1"
                  >
                    <CheckCircle2 size={16} /> Alterações guardadas localmente
                  </motion.span>
                )}
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Guardar Configurações
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
