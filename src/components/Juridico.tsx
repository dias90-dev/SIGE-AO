import React, { useState, useRef, useEffect } from 'react';
import { Scale, Bot, Send, Search, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/src/lib/utils';
import { Message } from '@/src/types';

const Juridico: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Bem-vindo à Assessoria Jurídica Digital do SIGE Angola. 
      Eu estou atualizado com a **Nova Lei Geral do Trabalho (Lei n.º 12/23)**. 
      Como posso ajudar sua instituição hoje? (Modo Híbrido: Online/Offline)`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Local knowledge base for offline support (FAQ)
  const OFFLINE_KNOWLEDGE: Record<string, string> = {
    "medidas disciplinares": "De acordo com o **Artigo 87.º** da LGT 12/23, as medidas são: Admoestação (oral/registada), Despromoção temporária, Redução salarial, Suspensão e Despedimento disciplinar.",
    "salário mínimo": "Conforme o Decreto Presidencial n.º 152/24, o salário mínimo nacional é de **70.000 Kz** (Agosto 2024), com previsão de aumento para **100.000 Kz** em 2025.",
    "horário de trabalho": "O período normal de trabalho (**Artigo 148.º**) não pode exceder 44 horas semanais e 8 horas diárias, salvo acordos específicos.",
    "cláusula": "Para contratos de professores, recomenda-se incluir cláusulas de exclusividade e dedicação pedagógica conforme o estatuto do agente de educação.",
    "férias": "O trabalhador tem direito a 22 dias úteis de férias remuneradas por cada ano de trabalho efetivo (**Artigo 188.º**)."
  };

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const query = userMessage.toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    // 1. Check Offline FAQ
    const offlineMatch = Object.keys(OFFLINE_KNOWLEDGE).find(key => query.includes(key));
    if (offlineMatch) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `${OFFLINE_KNOWLEDGE[offlineMatch]} \n\n *(Nota: Esta resposta foi gerada a partir da base de dados local offline).*` 
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // 2. Check Local Cache for AI responses
    const cacheKey = `sige_juridico_cache_${query}`;
    const cachedResponse = localStorage.getItem(cacheKey);
    if (cachedResponse) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: cachedResponse }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // 3. Online Request to Gemini
    if (!navigator.onLine) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Você está offline. Tente perguntar sobre "salário mínimo", "medidas disciplinares" ou "prazos" para obter respostas da base local.' 
      }]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/juridico/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) throw new Error('Falha na resposta da IA');
      
      const data = await response.json();
      localStorage.setItem(cacheKey, data.text); // Save to cache
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao consultar a base jurídica online. Tente novamente mais tarde.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Quais são as medidas disciplinares?",
    "Horário de trabalho docente",
    "Novas regras de salário mínimo",
    "Contratos de curta duração"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full space-y-6"
    >
      <header className="shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Scale className="text-amber-600" />
          Compliance & Assessoria Jurídica IA
        </h2>
        <p className="text-sm text-slate-500">
          Inteligência Artificial atualizada com a <strong className="text-blue-600">Lei n.º 12/23</strong>.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* LGT Reference Panel */}
        <div className="col-span-1 space-y-4">
          <div className="bg-indigo-600 p-5 rounded-xl text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Dica Jurídica do Dia</p>
              <p className="text-sm font-medium">LGT Artigo 14.º: O contrato de trabalho deve sempre ser reduzido a escrito se exceder 90 dias.</p>
            </div>
            <Scale className="absolute -bottom-4 -right-4 size-24 opacity-10 rotate-12" />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">NOVA LGT</div>
            <h3 className="font-bold text-sm text-blue-900 flex items-center gap-2 mb-1 mt-2">
              <FileDown className="text-red-500" size={24} />
              Diário da República (Lei 12/23)
            </h3>
            <p className="text-xs text-blue-800">Clique para consultar os 103 artigos.</p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Sugestões de Consulta</h3>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(s)}
                  className="w-full text-left p-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded transition-colors border border-transparent hover:border-blue-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <h3 className="font-bold text-sm">Consultor Jurídico SIGE</h3>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50 custom-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm",
                    msg.role === 'assistant' ? "bg-blue-600" : "bg-slate-800"
                  )}>
                    {msg.role === 'assistant' ? <Bot size={18} /> : <span className="text-[10px] uppercase font-bold">EU</span>}
                  </div>
                  <div className={cn(
                    "p-4 rounded-xl shadow-sm border text-sm prose prose-slate max-w-none prose-sm",
                    msg.role === 'assistant' 
                      ? "bg-white border-blue-100 rounded-tl-none" 
                      : "bg-slate-800 border-slate-700 text-white rounded-tr-none"
                  )}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white animate-pulse">
                  <Bot size={18} />
                </div>
                <div className="bg-white p-4 rounded-xl rounded-tl-none border border-blue-100 shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Pesquise sobre a LGT ou regulamentos MED..."
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Search size={18} />
                Consultar
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Juridico;
