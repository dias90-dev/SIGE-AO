export type View = 
  | 'dashboard' 
  | 'directoria' 
  | 'financeiro' 
  | 'academico' 
  | 'rh' 
  | 'patrimonio' 
  | 'documentos' 
  | 'juridico' 
  | 'configuracoes'
  | 'quem-somos'
  | 'servicos'
  | 'contato';

export interface Student {
  id: string;
  name: string;
  class: string;
  status: 'PAGO' | 'PENDENTE' | 'ATRASADO';
  lastPayment?: string;
  grades?: {
    mac: number;
    cpp: number;
    ct: number;
    absences: number;
  };
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  status: 'PRESENTE' | 'AUSENTE';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
