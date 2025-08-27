import React from 'react';
import { Users, Ticket, CheckCircle, Clock, GraduationCap, TrendingUp } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';

interface StatsPanelProps {
  database: ReturnType<typeof useDatabase>;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ database }) => {
  const stats = database.getStats();

  const statCards = [
    {
      title: 'Total de Formandos',
      value: stats.totalFormandos,
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Convites Gerados',
      value: stats.totalConvidados,
      icon: Ticket,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Convites Utilizados',
      value: stats.convitesUtilizados,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Convites Ativos',
      value: stats.convitesAtivos,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Entradas Inteiras',
      value: stats.entradasInteiras,
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Meias Entradas',
      value: stats.entradasMeias,
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const utilizationRate = stats.totalConvidados > 0 
    ? ((stats.convitesUtilizados / stats.totalConvidados) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de eventos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-xl p-6 border border-gray-200 hover-lift animate-slide-in`} style={{animationDelay: `${index * 0.1}s`}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} hover-scale`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-elegant p-6 hover-lift">
        <h3 className="text-xl font-bold text-gradient mb-4">Taxa de Utilização</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Convites utilizados</span>
          <span className="text-sm font-medium text-gray-900">{utilizationRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="gradient-success h-2 rounded-full state-transition"
            style={{ width: `${utilizationRate}%` }}
          ></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Utilizados:</span> {stats.convitesUtilizados}
          </div>
          <div>
            <span className="font-medium">Restantes:</span> {stats.convitesAtivos}
          </div>
        </div>
      </div>

      {stats.totalConvidados === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center animate-bounce-custom">
          <Ticket className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse-custom" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">Nenhum convite gerado</h3>
          <p className="text-blue-700">
            Comece cadastrando formandos e depois gere convites para os convidados.
          </p>
        </div>
      )}
    </div>
  );
};