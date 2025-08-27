import React, { useState } from 'react';
import { Search, Filter, CheckCircle, Clock, User, Mail, Calendar } from 'lucide-react';
import { Convidado, Formando } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConvidadosListProps {
  convidados: Convidado[];
  formandos: Formando[];
}

export const ConvidadosList: React.FC<ConvidadosListProps> = ({ convidados, formandos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'utilizado'>('todos');
  const [typeFilter, setTypeFilter] = useState<'todos' | 'inteira' | 'meia'>('todos');

  const getFormandoName = (formandoId: string) => {
    const formando = formandos.find(f => f.id === formandoId);
    return formando ? formando.nome : 'Formando não encontrado';
  };

  const filteredConvidados = convidados.filter(convidado => {
    const formandoName = getFormandoName(convidado.formandoId);
    const matchesSearch = convidado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formandoName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || convidado.status === statusFilter;
    const matchesType = typeFilter === 'todos' || convidado.tipoConvite === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: Convidado['status']) => {
    if (status === 'utilizado') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Utilizado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Ativo
      </span>
    );
  };

  const getTypeBadge = (tipo: Convidado['tipoConvite']) => {
    const isInteira = tipo === 'inteira';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isInteira ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
      }`}>
        {isInteira ? 'Inteira' : 'Meia'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Convidados</h1>
        <p className="text-gray-600">Gerencie e visualize todos os convites</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativos</option>
            <option value="utilizado">Utilizados</option>
          </select>

          {/* Filtro de Tipo */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="inteira">Entrada Inteira</option>
            <option value="meia">Meia Entrada</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredConvidados.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum convite encontrado</h3>
            <p className="text-gray-600">
              {convidados.length === 0 
                ? 'Nenhum convite foi gerado ainda.'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Convidado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formando
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConvidados.map((convidado) => (
                  <tr key={convidado.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {convidado.nome}
                          </div>
                          {convidado.email && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {convidado.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getFormandoName(convidado.formandoId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(convidado.tipoConvite)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(convidado.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <div>Criado: {format(new Date(convidado.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</div>
                          {convidado.usedAt && (
                            <div className="text-green-600">
                              Usado: {format(new Date(convidado.usedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{filteredConvidados.length}</div>
            <div className="text-sm text-gray-600">Exibindo</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {filteredConvidados.filter(c => c.status === 'utilizado').length}
            </div>
            <div className="text-sm text-gray-600">Utilizados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {filteredConvidados.filter(c => c.tipoConvite === 'inteira').length}
            </div>
            <div className="text-sm text-gray-600">Inteiras</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {filteredConvidados.filter(c => c.tipoConvite === 'meia').length}
            </div>
            <div className="text-sm text-gray-600">Meias</div>
          </div>
        </div>
      </div>
    </div>
  );
};