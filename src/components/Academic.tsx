import React, { useState, useEffect } from 'react';
import { GraduationCap, Save, Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface StudentData {
  id: string;
  name: string;
  mac: number;
  cpp: number;
  absences: number;
}

const Academic: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  // Simulated lazy loading / API fetch
  const fetchStudents = async () => {
    setLoading(true);
    // Simulate network delay for lazy loading feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data for initial load
    const mockStudents: StudentData[] = [
      { id: '1', name: 'Ana Sebastião', mac: 14, cpp: 16, absences: 0 },
      { id: '2', name: 'Carlos Manuel', mac: 9, cpp: 11, absences: 2 },
      { id: '3', name: 'Domingos José', mac: 12, cpp: 13, absences: 1 },
      { id: '4', name: 'Isabel Kelson', mac: 15, cpp: 14, absences: 0 },
      { id: '5', name: 'Kelson Paulo', mac: 11, cpp: 11, absences: 3 },
      { id: '6', name: 'Mateus Ndongala', mac: 8, cpp: 9, absences: 5 },
      { id: '7', name: 'Nádia Costa', mac: 18, cpp: 19, absences: 0 },
      { id: '8', name: 'Paulo Miguel', mac: 13, cpp: 12, absences: 1 },
    ];
    
    setStudents(mockStudents);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const updateGrade = (id: string, field: 'mac' | 'cpp' | 'absences', value: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Pauta guardada com sucesso!');
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <header className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="text-blue-600" />
            Lançamento de Notas (Mini-Pauta)
          </h2>
          <p className="text-sm text-slate-500">Fórmula MED Angola: CT = (MAC + CPP) / 2</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm outline-none w-40"
            />
          </div>
          <button 
            onClick={fetchStudents}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Turma:</span>
              <span className="text-xs font-bold text-slate-800">12ª Classe B</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disciplina:</span>
              <span className="text-xs font-bold text-slate-800">Matemática</span>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar Alterações
          </button>
        </div>
        
        <div className="overflow-x-auto relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="animate-spin text-blue-600 size-10 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-500">Carregando dados dos alunos...</p>
              </div>
            </div>
          )}

          <table className="w-full text-center text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">Nome do Aluno</th>
                <th className="px-4 py-4 border-l border-slate-100" title="Média de Avaliação Contínua">MAC</th>
                <th className="px-4 py-4" title="Classificação da Prova do Professor">CPP</th>
                <th className="px-4 py-4 border-l border-slate-200 bg-slate-100 text-slate-800" title="Classificação Trimestral">CT (Final)</th>
                <th className="px-4 py-4 border-l border-slate-100 text-red-500">Faltas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredStudents.map((student, index) => {
                  const ct = (student.mac + student.cpp) / 2;
                  return (
                    <motion.tr 
                      key={student.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "transition-colors group",
                        ct < 10 ? "bg-red-50/50 hover:bg-red-100/50" : "hover:bg-blue-50/30"
                      )}
                    >
                      <td className="px-6 py-4 text-left">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-l border-slate-50">
                        <input 
                          type="number" 
                          value={student.mac} 
                          onChange={(e) => updateGrade(student.id, 'mac', Number(e.target.value))}
                          className={cn(
                            "w-16 text-center border rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            student.mac < 10 ? "border-red-300 text-red-600 bg-red-50" : "border-slate-200 bg-white"
                          )}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="number" 
                          value={student.cpp} 
                          onChange={(e) => updateGrade(student.id, 'cpp', Number(e.target.value))}
                          className="w-16 text-center border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                        />
                      </td>
                      <td className={cn(
                        "px-4 py-4 border-l border-slate-200 bg-slate-50/50 font-bold",
                        ct < 10 ? "text-red-500" : "text-emerald-600"
                      )}>
                        {ct.toFixed(1)}
                      </td>
                      <td className="px-4 py-4 border-l border-slate-50">
                        <input 
                          type="number" 
                          value={student.absences} 
                          onChange={(e) => updateGrade(student.id, 'absences', Number(e.target.value))}
                          className="w-14 text-center border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all bg-white text-red-500 font-bold"
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          
          {!loading && filteredStudents.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400 font-medium">Nenhum aluno encontrado para "{searchTerm}".</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Academic;
