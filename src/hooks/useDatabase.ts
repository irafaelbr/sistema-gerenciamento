import { useState, useEffect } from 'react';
import { Formando, Convidado, ValidationResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useDatabase = () => {
  const [formandos, setFormandos] = useState<Formando[]>([]);
  const [convidados, setConvidados] = useState<Convidado[]>([]);

  useEffect(() => {
    const storedFormandos = localStorage.getItem('eventApp_formandos');
    const storedConvidados = localStorage.getItem('eventApp_convidados');
    
    if (storedFormandos) setFormandos(JSON.parse(storedFormandos));
    if (storedConvidados) setConvidados(JSON.parse(storedConvidados));
  }, []);

  const saveFormandos = (data: Formando[]) => {
    setFormandos(data);
    localStorage.setItem('eventApp_formandos', JSON.stringify(data));
  };

  const saveConvidados = (data: Convidado[]) => {
    setConvidados(data);
    localStorage.setItem('eventApp_convidados', JSON.stringify(data));
  };

  const addFormando = (formando: Omit<Formando, 'id' | 'createdAt'>) => {
    const newFormando: Formando = {
      ...formando,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    saveFormandos([...formandos, newFormando]);
    return newFormando;
  };

  const addConvidado = (convidado: Omit<Convidado, 'id' | 'createdAt' | 'status'>) => {
    const newConvidado: Convidado = {
      ...convidado,
      id: uuidv4(),
      status: 'ativo',
      createdAt: new Date().toISOString()
    };
    saveConvidados([...convidados, newConvidado]);
    return newConvidado;
  };

  const validateQRCode = (qrCode: string): ValidationResult => {
    const convidado = convidados.find(c => c.qrCode === qrCode);
    
    if (!convidado) {
      return {
        valid: false,
        message: 'QR Code inválido',
        type: 'error'
      };
    }

    const formando = formandos.find(f => f.id === convidado.formandoId);

    if (convidado.status === 'utilizado') {
      return {
        valid: false,
        convidado,
        formando,
        message: 'Convite já foi utilizado',
        type: 'warning'
      };
    }

    // Marcar como utilizado
    const updatedConvidados = convidados.map(c => 
      c.id === convidado.id 
        ? { ...c, status: 'utilizado' as const, usedAt: new Date().toISOString() }
        : c
    );
    saveConvidados(updatedConvidados);

    return {
      valid: true,
      convidado: { ...convidado, status: 'utilizado', usedAt: new Date().toISOString() },
      formando,
      message: 'Convite válido - Entrada liberada',
      type: 'success'
    };
  };

  const getStats = () => {
    const totalConvidados = convidados.length;
    const utilizados = convidados.filter(c => c.status === 'utilizado').length;
    const inteiras = convidados.filter(c => c.tipoConvite === 'inteira').length;
    const meias = convidados.filter(c => c.tipoConvite === 'meia').length;

    return {
      totalFormandos: formandos.length,
      totalConvidados,
      convitesUtilizados: utilizados,
      convitesAtivos: totalConvidados - utilizados,
      entradasInteiras: inteiras,
      entradasMeias: meias
    };
  };

  return {
    formandos,
    convidados,
    addFormando,
    addConvidado,
    validateQRCode,
    getStats
  };
};