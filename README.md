# SIGE Angola - ERP Masterpiece Edition

**SIGE Angola** (Sistema Integrado de Gestão Escolar) é uma solução ERP robusta e moderna, desenvolvida especificamente para o contexto educacional de Angola.

## 🚀 Funcionalidades Principais

- **Dashboard Inteligente**: Gráficos de performance acadêmica e financeira em tempo real (Recharts).
- **IA Jurídica (LGT 12/23)**: Chatbot integrado com a Nova Lei Geral do Trabalho de Angola, com suporte a modo offline.
- **Portal Acadêmico**: Lançamento de notas seguindo as fórmulas do MED (CT = MAC + CPP / 2) com destaques visuais para alunos com notas negativas.
- **Finanças Automáticas**: Simulação de pagamentos via MCX (EMIS) e exportação de relatórios em PDF, Excel e Word.
- **Gestão de Patrimônio**: Controle completo de laboratórios, salas e frotas de transporte.
- **Offline First**: Cache local de dados e base de conhecimento jurídica residente no navegador.
- **Design Responsivo**: Interface otimizada para Desktop, Tablets e Mobile.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Motion (animações).
- **Backend**: Node.js, Express.
- **IA**: Google Gemini 2.0 (via @google/genai).
- **Gráficos**: Recharts.
- **Iconografia**: Lucide React.

## 📦 Como Rodar o Projeto

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar Ambiente**:
   Crie um arquivo `.env` baseado no `.env.example` e adicione sua `GEMINI_API_KEY`.

3. **Desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Build de Produção**:
   ```bash
   npm run build
   npm start
   ```

## 📄 Licença
Este projeto é uma demonstração tecnológica para gestão escolar em Angola.
