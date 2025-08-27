import React, { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = onLogin(username, password);
    
    if (!success) {
      setError('Credenciais inválidas');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4 animate-fade-in">
      <div className="card-elegant p-8 w-full max-w-md hover-lift">
        <div className="text-center mb-8">
          <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-custom">
            <LogIn className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gradient animate-slide-in">
            EventApp
          </h1>
          <p className="text-gray-600 mt-2">Sistema de Gerenciamento de Eventos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-elegant w-full pl-10 pr-4 focus-ring state-transition"
                placeholder="Digite seu usuário"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-elegant w-full pl-10 pr-4 focus-ring state-transition"
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 px-4 disabled:opacity-50 hover-lift"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
          <p className="text-sm text-gray-600 text-center">
            Credenciais de teste:<br />
            <strong>Usuário:</strong> admin<br />
            <strong>Senha:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
};