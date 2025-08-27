import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Camera, CheckCircle, XCircle, AlertTriangle, CameraOff } from 'lucide-react';
import { ValidationResult } from '../types';

interface QRScannerProps {
  onValidate: (qrCode: string) => ValidationResult;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onValidate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    let qrScanner: QrScanner | null = null;

    const initScanner = async () => {
      if (videoRef.current) {
        try {
          qrScanner = new QrScanner(
            videoRef.current,
            (result) => {
              const validation = onValidate(result.data);
              setResult(validation);
              
              // Para o scanner temporariamente após uma leitura
              setTimeout(() => {
                setResult(null);
              }, 4000);
            },
            {
              highlightScanRegion: true,
              highlightCodeOutline: true,
            }
          );

          setScanner(qrScanner);
        } catch (error) {
          console.error('Erro ao inicializar scanner:', error);
          setHasCamera(false);
        }
      }
    };

    initScanner();

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [onValidate]);

  const startScanning = async () => {
    if (scanner) {
      try {
        await scanner.start();
        setIsScanning(true);
        setResult(null);
      } catch (error) {
        console.error('Erro ao iniciar scanner:', error);
        setHasCamera(false);
      }
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.stop();
      setIsScanning(false);
    }
  };

  const getResultIcon = () => {
    if (!result) return null;
    
    switch (result.type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getResultBgColor = () => {
    if (!result) return '';
    
    switch (result.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return '';
    }
  };

  if (!hasCamera) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Câmera não disponível</h2>
          <p className="text-gray-600">
            Para usar o scanner de QR Code, é necessário permitir acesso à câmera do dispositivo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card-elegant overflow-hidden hover-lift">
        <div className="p-6 gradient-success text-white">
          <div className="flex items-center">
            <Camera className="w-8 h-8 mr-3 animate-pulse-custom" />
            <div>
              <h2 className="text-2xl font-bold">Scanner de QR Code</h2>
              <p className="opacity-90">Aponte a câmera para o QR Code do convite</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <video
              ref={videoRef}
              className="scanner-frame w-full h-80 bg-gray-900 object-cover scanner-overlay"
            />
            {!isScanning && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                <button
                  onClick={startScanning}
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 state-transition flex items-center hover-lift"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Iniciar Scanner
                </button>
              </div>
            )}
          </div>

          {isScanning && (
            <div className="flex justify-center mb-6">
              <button
                onClick={stopScanning}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 state-transition hover-lift"
              >
                Parar Scanner
              </button>
            </div>
          )}

          {result && (
            <div className={`border rounded-lg p-6 ${getResultBgColor()} animate-bounce-custom`}>
              <div className="flex items-start">
                {getResultIcon()}
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-lg mb-2">{result.message}</h3>
                  
                  {result.convidado && result.formando && (
                    <div className="space-y-2 text-sm">
                      <p><strong>Convidado:</strong> {result.convidado.nome}</p>
                      <p><strong>Formando:</strong> {result.formando.nome}</p>
                      <p><strong>Curso:</strong> {result.formando.curso}</p>
                      <p><strong>Tipo de Convite:</strong> {result.convidado.tipoConvite === 'inteira' ? 'Entrada Inteira' : 'Meia Entrada'}</p>
                      {result.convidado.usedAt && (
                        <p><strong>Utilizado em:</strong> {new Date(result.convidado.usedAt).toLocaleString('pt-BR')}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};