export interface Formando {
  id: string;
  nome: string;
  curso: string;
  email: string;
  telefone: string;
  createdAt: string;
}

export interface Convidado {
  id: string;
  formandoId: string;
  nome: string;
  email?: string;
  tipoConvite: 'inteira' | 'meia';
  qrCode: string;
  status: 'ativo' | 'utilizado';
  createdAt: string;
  usedAt?: string;
}

export interface ValidationResult {
  valid: boolean;
  convidado?: Convidado;
  formando?: Formando;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export interface User {
  id: string;
  username: string;
  role: 'admin';
}