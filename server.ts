import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

export async function createServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.get("/api/dashboard/stats", async (req, res) => {
    // Simulate DB fetch
    res.json({
      stats: [
        { label: 'Alunos', value: '1,845', change: '+12%', trend: 'up' },
        { label: 'Professores', value: '78', change: '0%', trend: 'neutral' },
        { label: 'Receitas Mês', value: '82%', change: '+5%', trend: 'up' },
        { label: 'Salas Ativas', value: '42', change: '-2', trend: 'down' },
      ],
      recentActivity: [
        { id: 1, title: 'Novo pagamento confirmado', user: 'Manuel D.', time: '12:45' },
        { id: 2, title: 'Pauta 12ª B publicada', user: 'Prof. Afonso', time: '10:30' },
        { id: 3, title: 'Circular MED recebida', user: 'Admin', time: '09:15' },
      ],
      timestamp: Date.now()
    });
  });

  app.get("/api/finance/export/:format", (req, res) => {
    const { format } = req.params;
    // In a real app, we'd use libraries like jspdf, exceljs, docx
    // Here we simulate the trigger
    res.json({ 
      success: true, 
      message: `Relatório Financeiro em ${format.toUpperCase()} gerado com sucesso.`,
      downloadUrl: `#mock-download-${format}`
    });
  });

  app.post("/api/juridico/chat", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `Você é o Consultor Jurídico Sênior do SIGE Angola. 
          Sua especialidade é a Nova Lei Geral do Trabalho (Lei n.º 12/23) e regulamentações do MED.
          
          REGRAS DE RESPOSTA:
          1. Sempre use Português de Angola (ex: "propinas", "encarregados", "trimestre").
          2. Comece respostas simples com uma saudação formal.
          3. Ao citar a LGT 12/23, use negrito para o número do Artigo.
          4. Se a pergunta for sobre salários, lembre que o mínimo é 70.000 Kz (pode variar por setor).
          5. Use tabelas em Markdown para comparar benefícios ou prazos se apropriado.
          6. Termine sempre oferecendo ajuda para redigir uma cláusula ou circular.`,
        },
      });

      const response = await chat.sendMessage({ message: prompt });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Erro na consulta à IA Jurídica. Verifique sua chave API." });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In Vercel environment or production outside of it
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Check if file exists, if not serve index.html
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return { app, PORT };
}

createServer().then(({ app, PORT }) => {
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
});
