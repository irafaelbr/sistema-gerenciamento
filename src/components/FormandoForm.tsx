import React, { useState } from 'react';
import { User, Mail, Phone, GraduationCap, Plus, CheckCircle } from 'lucide-react';
import { Formando } from '../types';

interface FormandoFormProps {
  onFormandoAdded: (formando: Omit<Formando, 'id' | 'createdAt'>) => Formando;
}

export const FormandoForm: React.FC<FormandoFormProps> = ({ onFormandoAdded }) => {
  const [formData, setFormData] = useState({
    nome: '',
    curso: '',
    email: '',
    telefone: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormandoAdded(formData);
    setFormData({ nome: '', curso: '', email: '', telefone: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card-elegant p-8 hover-lift">
        <div className="flex items-center mb-6">
          <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gradient">Cadastrar Formando</h2>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center animate-bounce-custom">
            <CheckCircle className="w-5 h-5 mr-2" />
            Formando cadastrado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="input-elegant w-full pl-10 pr-4 focus-ring state-transition"
                  placeholder="Digite o nome completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  className="input-elegant w-full pl-10 pr-4 focus-ring state-transition"
                  placeholder="Ex: Ciência da Computação"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-elegant w-full pl-10 pr-4 focus-ring state-transition"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="input-elegant w-full pl-10 pr-4 focus-ring state-transition"
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 px-4 flex items-center justify-center hover-lift"
          >
            <Plus className="w-5 h-5 mr-2" />
            Cadastrar Formando
          </button>
        </form>
      </div>
    </div>
  );
};