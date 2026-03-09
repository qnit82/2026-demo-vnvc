import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AppAlert = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info'
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const config = {
    info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Info size={24} /> },
    success: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <CheckCircle2 size={24} /> },
    error: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <AlertCircle size={24} /> },
    warning: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <AlertTriangle size={24} /> },
  };

  const { color, bg, border, icon } = config[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md ${bg} border ${border} rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className={color}>{icon}</div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${color}`}>{title || t('notification')}</h3>
              <p className="mt-2 text-gray-300 leading-relaxed">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-xl font-bold text-white transition-all active:scale-95 ${color.replace('text', 'bg').replace('-400', '-600')} hover:brightness-110`}
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        onConfirm();
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-dark-card border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-white">{title || t('confirm')}</h3>
          <p className="mt-4 text-gray-400 leading-relaxed">{message}</p>

          <div className="mt-8 flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-gray-700 font-bold text-gray-300 hover:bg-gray-800 hover:text-white transition-all active:scale-95"
            >
              {cancelText || t('cancel')}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-6 py-2 rounded-xl font-bold text-white bg-dark-primary hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              {confirmText || t('agree')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AppAlert, AppConfirm };
