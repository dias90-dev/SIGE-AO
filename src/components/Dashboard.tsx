import React, { useState, useEffect } from 'react';
import { Users, Presentation, Wallet, Building2, Calendar, TrendingUp, TrendingDown, RefreshCw, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

interface DashData {
  stats: Array<{ label: string; value: string; change: string; trend: 'up' | 'down' | 'neutral' }>;
  recentActivity: Array<{ id: number; title: string; user: string; time: string }>;
  revenueData: Array<{ name: string; value: number }>;
  gradeDistribution: Array<{ name: string; students: number }>;
  timestamp: number;
}

const CACHE_KEY = 'sige_dashboard_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (force = false) => {
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as DashData;
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          setData(parsed);
          setLoading(false);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      const json = await res.json();
      
      // Add chart data if not present from API
      const enrichedData = {
        ...json,
        revenueData: [
          { name: 'Jan', value: 4000 },
          { name: 'Fev', value: 3000 },
          { name: 'Mar', value: 2000 },
          { name: 'Abr', value: 2780 },
          { name: 'Mai', value: 1890 },
        ],
        gradeDistribution: [
          { name: '< 10', students: 120 },
          { name: '10-12', students: 450 },
          { name: '13-15', students: 300 },
          { name: '16-18', students: 180 },
          { name: '19-20', students: 45 },
        ]
      };

      setData(enrichedData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(enrichedData));
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statsConfig = [
    { icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: Presentation, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { icon: Wallet, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { icon: Building2, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  if (loading && !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600 size-10" />
      </div>
    );
  }

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Institucional</h2>
          <p className="text-sm text-slate-500">
            {loading ? "A atualizar dados..." : "Visão geral da performance acadêmica e financeira."}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchData(true)}
            disabled={loading}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          </button>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold shadow-sm flex items-center gap-2 w-max">
            <Calendar className="text-blue-600 size-4" />
            {new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {data?.stats.map((stat, i) => {
          const Config = statsConfig[i];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-100 relative group overflow-hidden"
            >
              <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", Config.bgColor, Config.color)}>
                <Config.icon className="size-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                    stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : 
                    stat.trend === 'down' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
                  )}>
                    {stat.trend === 'up' && <TrendingUp size={10} />}
                    {stat.trend === 'down' && <TrendingDown size={10} />}
                    {stat.change}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-500" />
              Evolução de Receitas (Kz)
            </h3>
            <select className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border-none outline-none cursor-pointer">
              <option>Vistos Mensais</option>
              <option>Vistos Trimestrais</option>
              <option>Vistos Anuais</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChartIcon size={18} className="text-purple-500" />
            Distribuição de Notas
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="students"
                >
                  {data?.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data?.gradeDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{entry.name}: {entry.students}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex justify-between items-center">
            Atividade Recente
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Real-time</span>
          </h3>
          <div className="space-y-4">
            {data?.recentActivity.map(activity => (
              <div key={activity.id} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-bold border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-400">Por: {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Estado das Unidades (Polos)</h3>
            <div className="space-y-4">
              {['Polo Talatona', 'Polo Benfica', 'Polo Viana'].map((polo) => (
                <div key={polo} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-700 font-medium">{polo}</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-2">
                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
                    Operacional
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white relative overflow-hidden shadow-lg shadow-blue-600/20">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase opacity-70 tracking-widest">Dica Estratégica</p>
              <p className="text-sm mt-2 leading-relaxed">As médias do Polo Talatona subiram 15% após a implementação do reforço de Matemática. Considere aplicar o mesmo modelo em Viana.</p>
            </div>
            <TrendingUp className="absolute -bottom-4 -right-4 size-24 opacity-10 rotate-12" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
