import React, { useState } from 'react';
import { LogOut, Users, QrCode, ScanLine, BarChart3, UserPlus, Ticket } from 'lucide-react';
import { FormandoForm } from './FormandoForm';
import { ConvidadoForm } from './ConvidadoForm';
import { QRScanner } from './QRScanner';
import { StatsPanel } from './StatsPanel';
import { ConvidadosList } from './ConvidadosList';
import { useDatabase } from '../hooks/useDatabase';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<'stats' | 'formandos' | 'convidados' | 'scanner' | 'list'>('stats');
  const database = useDatabase();

  const navItems = [
    { id: 'stats', label: 'Dashboard', icon: BarChart3 },
    { id: 'formandos', label: 'Formandos', icon: UserPlus },
    { id: 'convidados', label: 'Convidados', icon: Users },
    { id: 'scanner', label: 'Scanner', icon: ScanLine },
    { id: 'list', label: 'Lista', icon: Ticket }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'stats':
        return <StatsPanel database={database} />;
      case 'formandos':
        return <FormandoForm onFormandoAdded={database.addFormando} />;
      case 'convidados':
        return <ConvidadoForm formandos={database.formandos} onConvidadoAdded={database.addConvidado} />;
      case 'scanner':
        return <QRScanner onValidate={database.validateQRCode} />;
      case 'list':
        return <ConvidadosList convidados={database.convidados} formandos={database.formandos} />;
      default:
        return <StatsPanel database={database} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <QrCode className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventApp
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id as any)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors text-left ${
                      activeView === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};