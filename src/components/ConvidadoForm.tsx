import React, { useState } from 'react';
import { User, Mail, Ticket, Plus, CheckCircle, QrCode, Download } from 'lucide-react';
import { Formando, Convidado } from '../types';
import { generateQRCode } from '../utils/qrCodeGenerator';
import { v4 as uuidv4 } from 'uuid';

interface ConvidadoFormProps {
  formandos: Formando[];
  onConvidadoAdded: (convidado: Omit<Convidado, 'id' | 'createdAt' | 'status'>) => Convidado;
}

export const ConvidadoForm: React.FC<ConvidadoFormProps> = ({ formandos, onConvidadoAdded }) => {
  const [formData, setFormData] = useState({
    formandoId: '',
    nome: '',
    email: '',
    tipoConvite: 'inteira' as 'inteira' | 'meia'
  });
  const [success, setSuccess] = useState(false);
  const [generatedConvidado, setGeneratedConvidado] = useState<Convidado | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const qrCode = uuidv4();
    const convidado = onConvidadoAdded({
      ...formData,
      qrCode
    });

    try {
      const qrCodeDataUrl = await generateQRCode(qrCode);
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }

    setGeneratedConvidado(convidado);
    setFormData({ formandoId: '', nome: '', email: '', tipoConvite: 'inteira' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const downloadQRCode = () => {
    if (qrCodeUrl && generatedConvidado) {
      const link = document.createElement('a');
      link.download = `convite-${generatedConvidado.nome.replace(/\s/g, '-')}.png`;
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const selectedFormando = formandos.find(f => f.id === formData.formandoId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Ticket className="w-8 h-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Gerar Convite</h2>
        </div>

        {success && generatedConvidado && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-green-800 font-medium">Convite gerado com sucesso!</h3>
                <div className="mt-4 grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-green-700">
                      <strong>Convidado:</strong> {generatedConvidado.nome}<br />
                      <strong>Tipo:</strong> {generatedConvidado.tipoConvite === 'inteira' ? 'Entrada Inteira' : 'Meia Entrada'}<br />
                      <strong>Formando:</strong> {selectedFormando?.nome}
                    </p>
                  </div>
                  {qrCodeUrl && (
                    <div className="text-center">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code do convite" 
                        className="w-32 h-32 mx-auto border rounded-lg shadow-sm" 
                      />
                      <button
                        onClick={downloadQRCode}
                        className="mt-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors flex items-center mx-auto"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Baixar QR
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formando
            </label>
            <select
              name="formandoId"
              value={formData.formandoId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Selecione o formando...</option>
              {formandos.map(formando => (
                <option key={formando.id} value={formando.id}>
                  {formando.nome} - {formando.curso}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Convidado
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Nome do convidado"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Opcional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Convite
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="tipoConvite"
                  value="inteira"
                  checked={formData.tipoConvite === 'inteira'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Entrada Inteira</div>
                  <div className="text-sm text-gray-500">Valor cheio do ingresso</div>
                </div>
              </label>
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="tipoConvite"
                  value="meia"
                  checked={formData.tipoConvite === 'meia'}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Meia Entrada</div>
                  <div className="text-sm text-gray-500">50% do valor do ingresso</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={formandos.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium flex items-center justify-center disabled:opacity-50"
          >
            <QrCode className="w-5 h-5 mr-2" />
            Gerar Convite com QR Code
          </button>

          {formandos.length === 0 && (
            <p className="text-center text-gray-500 text-sm">
              Cadastre pelo menos um formando antes de gerar convites
            </p>
          )}
        </form>
      </div>
    </div>
  );
};