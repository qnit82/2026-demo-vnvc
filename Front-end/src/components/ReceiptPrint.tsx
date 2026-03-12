import React from 'react';
import { useTranslation } from 'react-i18next';
import util from '@/web-configs/util';
import { Invoice } from '@/types';

interface ReceiptPrintProps {
  invoice: Invoice | null;
  isPreviewLine?: boolean;
}

const ReceiptPrint: React.FC<ReceiptPrintProps> = ({ invoice, isPreviewLine = false }) => {
  const { t } = useTranslation();
  if (!invoice) return null;

  const getStatusDisplay = (status: number) => {
    switch (status) {
      case 1: // Paid
        return { label: t('status_paid'), color: 'text-green-600', dot: 'bg-green-500' };
      case 2: // Cancelled
        return { label: t('status_cancelled'), color: 'text-red-600', dot: 'bg-red-500' };
      default: // 0: Pending
        return { label: t('status_pending'), color: 'text-amber-600', dot: 'bg-amber-500' };
    }
  };

  const statusInfo = getStatusDisplay(invoice.paymentStatus);

  return (
    <div className={`${isPreviewLine ? '' : 'print-only'} bg-white text-black font-sans w-[210mm] min-h-[297mm] mx-auto p-[12mm] box-border relative overflow-hidden shadow-2xl print:shadow-none`}>

      {/* watermark nền mờ cho phiếu in*/}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none rotate-[-35deg] scale-[2]">
        <h1 className="text-[120px] font-black tracking-tighter text-blue-900 select-none">DEMO APP</h1>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start border-b border-blue-900 pb-3 mb-4 relative">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-900 text-white p-1.5 rounded shadow-sm">
            <h1 className="text-2xl italic leading-none">DEMO APP</h1>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase text-blue-900 tracking-tight">{t('system_name')}</p>
            <p className="text-[9px] text-gray-600 leading-tight">{t('address')}</p>
            <p className="text-[9px] text-gray-600">{t('hotline')}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-normal uppercase text-gray-900 mb-0.5 tracking-tight">{t('printe_title')}</h2>
          <div className="flex flex-col text-[10px] text-gray-500 font-mono">
            <span>{t('number')}{invoice.visitId}-{new Date().getTime().toString().slice(-4)}</span>
            <span>{t('date')} {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 mb-4 grid grid-cols-2 gap-6 text-[11px] avoid-break relative">
        <div className="space-y-1.5">
          <p className="flex items-center border-b border-gray-50 pb-1">
            <span className="text-gray-400 w-24">{t('customer')}</span>
            <span className="text-gray-900 font-normal uppercase">{invoice.fullName}</span>
          </p>
          <p className="flex items-center border-b border-gray-50 pb-1">
            <span className="text-gray-400 w-24">{t('patient_id')}</span>
            <span className="font-mono text-blue-800 font-normal">{invoice.pid}</span>
          </p>
          <p className="flex items-center">
            <span className="text-gray-400 w-24">{t('phone')}</span>
            <span className="text-gray-800 font-normal">{invoice.phone}</span>
          </p>
        </div>
        <div className="space-y-1.5">
          <p className="flex items-center border-b border-gray-50 pb-1">
            <span className="text-gray-400 w-24">{t('cashier')}</span>
            <span className="text-gray-900 font-normal uppercase">{t('demo_admin')}</span>
          </p>
          <p className="flex items-center border-b border-gray-50 pb-1">
            <span className="text-gray-400 w-24">{t('method')}</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded text-[9px] font-normal uppercase border border-blue-100">{t('method_transfer')}</span>
          </p>
          <p className="flex items-center">
            <span className="text-gray-400 w-24">{t('status')}</span>
            <span className={`${statusInfo.color} font-normal flex items-center`}>
              <span className={`w-1.5 h-1.5 ${statusInfo.dot} rounded-full mr-1.5`}></span>
              {statusInfo.label}
            </span>
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="avoid-break mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-3 py-2 text-left font-normal uppercase border-r border-blue-800/30">{t('no')}</th>
              <th className="px-3 py-2 text-left font-normal uppercase border-r border-blue-800/30">{t('content')}</th>
              <th className="px-3 py-2 text-center font-normal uppercase border-r border-blue-800/30">{t('qty')}</th>
              <th className="px-3 py-2 text-right font-normal uppercase border-r border-blue-800/30">{t('unit_price')}</th>
              <th className="px-3 py-2 text-right font-normal uppercase">{t('amount')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="even:bg-gray-50/20">
                <td className="px-3 py-2 text-center text-gray-500 font-mono">{idx + 1}</td>
                <td className="px-3 py-2 text-gray-900 uppercase">{item.vaccineName}</td>
                <td className="px-3 py-2 text-center font-normal text-blue-900">{item.quantity}</td>
                <td className="px-3 py-2 text-right font-mono text-gray-600">{util.formatVND(item.unitPrice)}</td>
                <td className="px-3 py-2 text-right font-normal font-mono text-gray-900">{util.formatVND(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50/50">
              <td colSpan={4} className="px-3 py-2 text-right font-normal uppercase text-[9px] text-gray-500">{t('total_amount')}</td>
              <td className="px-3 py-2 text-right text-[14px] font-normal font-mono text-blue-900 border-b border-blue-900">{util.formatVND(invoice.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Số tiền bằng chữ */}
      <div className="mb-6 px-1 flex items-center">
        <span className="text-gray-500 text-[10px] uppercase italic mr-2 whitespace-nowrap">{t('amount_in_words')}</span>
        <span className="text-[11px] font-normal text-blue-900 border-b border-dotted border-gray-300 flex-1 pb-0.5">{util.toVietnameseWords(invoice.totalAmount)}</span>
      </div>

      {/* Thanh toán */}
      <div className="flex bg-blue-50/30 border border-dotted border-blue-200 rounded-2xl p-3 mb-6 overflow-hidden avoid-break relative">
        <div className="flex-1 pr-6 border-r border-blue-100 flex flex-col justify-center relative">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1 h-5 bg-blue-700 rounded-full"></div>
            <h3 className="text-[12px] font-normal text-blue-900 uppercase tracking-tight">{t('smart_payment')}</h3>
          </div>
          <p className="text-[9px] text-gray-500 mb-3 leading-tight italic opacity-70">
            {t('auto_record_note')}
          </p>
          <div className="grid grid-cols-1 gap-1 text-[10px]">
            <p className="flex justify-between items-center text-gray-500">
              <span>{t('bank')}</span>
              <span className="font-normal text-blue-900 uppercase">{util.bank.bankId}</span>
            </p>
            <p className="flex justify-between items-center text-gray-500">
              <span>{t('account_name')}</span>
              <span className="font-normal text-gray-900 uppercase">{util.bank.name}</span>
            </p>
            <div className="flex justify-between items-center bg-blue-700 text-white px-2.5 py-1.5 rounded-lg mt-1">
              <span className="font-normal uppercase text-[8px] tracking-widest opacity-80">{t('account_number')}</span>
              <span className="font-mono font-bold text-[14px] tracking-wider">{util.bank.stk}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center bg-white p-1 rounded-lg shadow-sm ml-4 border border-blue-50 relative">
          <img
            src={util.getVietQRUrl(invoice.totalAmount)}
            alt="VietQR"
            className="w-28 h-28 object-contain"
          />
          <span className="text-[7px] font-normal text-blue-900 opacity-20 mt-0.5 uppercase">VIETQR • SECURE PAY</span>
        </div>
      </div>

      {/* Chữ ký */}
      <div className="grid grid-cols-3 gap-6 text-center text-[10px] avoid-break mt-6">
        <div>
          <p className="font-normal text-gray-400 uppercase mb-14 tracking-wider">{t('customer_sign')}</p>
          <p className="italic text-gray-300 text-[8px] uppercase">{t('customer_sign_note')}</p>
        </div>
        <div className="flex flex-col items-center relative">
          <p className="font-normal text-gray-600 uppercase mb-10 tracking-wider">{t('creator')}</p>
          <div className="absolute top-4 flex items-center justify-center opacity-[0.15] pointer-events-none scale-75">
            <div className="w-20 h-20 border-2 border-blue-600 rounded-full flex flex-col items-center justify-center text-blue-600 font-bold rotate-[-15deg] p-1">
              <span className="text-[7px] uppercase">{t('demo_admin')}</span>
              <span className="text-[8px] uppercase">{t('created')}</span>
            </div>
          </div>
          <p className="font-normal text-blue-900 uppercase text-[11px] mt-auto">NGUYÊN VĂN A</p>
        </div>
        <div className="flex flex-col items-center relative">
          <p className="font-normal text-gray-600 uppercase mb-10 tracking-wider">{t('chief_accountant')}</p>
          <div className="absolute top-4 flex items-center justify-center -rotate-6 opacity-[0.3] pointer-events-none scale-75">
            <div className="border border-emerald-500 rounded px-1.5 py-0.5 text-emerald-600">
              <span className="text-[8px] uppercase">{t('approved')}</span>
            </div>
          </div>
          <p className="text-gray-800 uppercase text-[11px] mt-auto font-normal">{t('approved')}</p>
        </div>
      </div>

      <div className="mt-10 text-center border-t border-gray-100 pt-3">
        <p className="text-[8px] text-gray-400 italic">{t('copyright')}</p>
      </div>
    </div>
  );
};

export default ReceiptPrint;
