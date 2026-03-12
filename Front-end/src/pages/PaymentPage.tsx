import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Loader2,
  CreditCard,
  Wallet,
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  ArrowRight,
  X,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import util from '@/web-configs/util';
import { PaymentQueueItem, Invoice } from '@/types';
import api from '@/web-configs/api';
import { AppAlert, AppConfirm } from '@/components/AppDialogs';
import ReceiptPrint from '@/components/ReceiptPrint';

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<PaymentQueueItem[]>([]);
  const [loadingQueue, setLoadingQueue] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0); // 0: Chờ thanh toán, 1: Đã thanh toán
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 8, totalCount: 0 });

  const [alertConfig, setAlertConfig] = useState<any>({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmConfig, setConfirmConfig] = useState<any>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  const fetchQueue = async (page = pagination.page, tab = activeTab, date = selectedDate) => {
    setLoadingQueue(true);
    try {
      const response = await api.get('/payment/queue', {
        params: {
          status: tab,
          date: date,
          page: page,
          pageSize: pagination.pageSize
        }
      });
      if (response.data.success && response.data.data) {
        setQueue(response.data.data.items || []);
        setPagination(prev => ({
          ...prev,
          totalCount: response.data.data.totalCount || 0,
          page: response.data.data.page || 1
        }));
      }
    } catch (error) {
      console.error('Fetch queue error:', error);
    } finally {
      setLoadingQueue(false);
    }
  };

  useEffect(() => {
    fetchQueue(1, activeTab, selectedDate);
  }, [activeTab, selectedDate]);

  useEffect(() => {
    const interval = setInterval(() => fetchQueue(pagination.page, activeTab, selectedDate), 30000);
    return () => clearInterval(interval);
  }, [pagination.page, activeTab, selectedDate]);

  const handleSelectVisit = async (visit: { visitId: string }) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/payment/${visit.visitId}`);
      if (response.data.success) {
        setSelectedInvoice(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching invoice detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedInvoice) return;

    setConfirmConfig({
      isOpen: true,
      title: t('payment_confirm_payment_title') || 'Confirm Payment',
      message: t('payment_confirm_payment_msg', 'Xác nhận khách hàng {{name}} đã thanh toán số tiền {{amount}}?', { name: selectedInvoice.fullName, amount: util.formatVND(selectedInvoice.totalAmount) }),
      onConfirm: async () => {
        setSubmitting(true);
        try {
          const response = await api.post('/payment/confirm', {
            visitId: selectedInvoice.visitId,
            paymentMethod: paymentMethod
          });

          if (response.data.success) {
            // Fetch lại data mới nhất để ReceiptPrint cập nhật trạng thái "Đã thanh toán"
            await handleSelectVisit({ visitId: selectedInvoice.visitId });
            fetchQueue();
          }
        } catch (error) {
          console.error('Payment confirmation failed:', error);
          setAlertConfig({
            isOpen: true,
            type: 'error',
            title: t('common_error') || 'Error',
            message: t('payment_confirm_payment_error') || 'Confirmation failed'
          });
        } finally {
          setSubmitting(false);
        }
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="max-w-[1600px] mx-auto pb-10 px-4 no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)]">

          {/* Left: Chờ thanh toán */}
          <div className="lg:col-span-4 flex flex-col bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-0 border-b border-gray-800 bg-gray-900/50">
              <div className="flex justify-between items-center p-5 border-b border-gray-800/50">
                <h3 className="text-[15px] text-white flex items-center font-bold">
                  <Receipt className="mr-2 text-dark-primary" size={20} />
                  {t('payment_transaction_list')}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDatePicker(true)}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center space-x-2 text-[12px]"
                  >
                    <Calendar size={16} />
                    <span>{new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex">
                <button
                  onClick={() => setActiveTab(0)}
                  className={`flex-1 py-3 text-[13px] font-bold transition-all relative ${activeTab === 0 ? 'text-dark-primary' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {t('payment_pending_tab')} ({activeTab === 0 ? pagination.totalCount : '...'})
                  {activeTab === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-primary"></div>}
                </button>
                <button
                  onClick={() => setActiveTab(1)}
                  className={`flex-1 py-3 text-[13px] font-bold transition-all relative ${activeTab === 1 ? 'text-dark-primary' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {t('payment_processed_tab')} ({activeTab === 1 ? pagination.totalCount : '...'})
                  {activeTab === 1 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-primary"></div>}
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder={t('common_search_placeholder') || 'Search...'}
                  className="w-full bg-dark-bg/80 border border-gray-700/50 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:border-dark-primary outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-800/50">
              {loadingQueue ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3">
                  <Loader2 className="animate-spin text-dark-primary" size={32} />
                  <p className="text-xs text-gray-500">{t('payment_loading_list')}</p>
                </div>
              ) : (
                <>
                  {(queue || []).map((item) => (
                    <div
                      key={item.visitId}
                      onClick={() => handleSelectVisit(item)}
                      className={`p-5 cursor-pointer transition-all duration-300 hover:translate-x-2 group border-l-4 ${selectedInvoice?.visitId === item.visitId
                        ? 'border-dark-primary bg-gradient-to-r from-dark-primary/20 to-transparent'
                        : 'border-transparent hover:bg-gray-800/80 hover:border-gray-700'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[12px] font-mono text-dark-primary font-bold">{item.pid}</span>
                        <div className="flex items-center text-[12px] text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {new Date(item.requestTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <h4 className="text-[15px] text-gray-200 mb-1">{item.fullName}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-gray-500">{new Date().getFullYear() - new Date(item.dob).getFullYear()} {t('common_age')} • {item.gender}</span>
                        <span className="text-[14px] text-indigo-400">{util.formatVND(item.totalAmount)}</span>
                      </div>
                    </div>
                  ))}

                  {queue.length === 0 && !loadingQueue && (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                        <Receipt size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-[14px]">{t('payment_no_data_date')}</p>
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              {pagination.totalCount > pagination.pageSize && (
                <div className="p-4 border-t border-gray-800 bg-gray-900/30 flex items-center justify-between">
                  <span className="text-[12px] text-gray-500 italic">
                    {t('payment_showing')} {queue.length} / {pagination.totalCount}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      disabled={pagination.page <= 1}
                      onClick={() => fetchQueue(pagination.page - 1)}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center px-3 space-x-1">
                      <span className="text-[13px] font-bold text-dark-primary">{pagination.page}</span>
                      <span className="text-[13px] text-gray-600">/</span>
                      <span className="text-[13px] text-gray-500">{Math.ceil(pagination.totalCount / pagination.pageSize)}</span>
                    </div>
                    <button
                      disabled={pagination.page >= Math.ceil(pagination.totalCount / pagination.pageSize)}
                      onClick={() => fetchQueue(pagination.page + 1)}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Chi tiết Order & Thanh toán */}
          <div className="lg:col-span-8 flex flex-col bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
            {!selectedInvoice ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
                <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <Wallet size={48} className="text-gray-500/50" />
                </div>
                <p className="text-lg font-medium opacity-50 uppercase tracking-tighter">{t('payment_select_invoice_prompt')}</p>
              </div>
            ) : (
              <>
                {/* Thông tin bệnh nhân */}
                <div className="p-8 border-b border-gray-800 bg-gradient-to-r from-indigo-500/10 to-transparent flex justify-between items-end">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-dark-primary text-white text-[10px] uppercase tracking-widest">{t('payment_invoice_tag')}</span>
                      <span className="text-gray-500 font-mono text-[12px]">INV-{selectedInvoice.visitId}-{new Date().getTime().toString().slice(-6)}</span>
                    </div>
                    <h2 className="text-3xl text-white mb-2">{selectedInvoice.fullName}</h2>
                    <div className="flex items-center space-x-4 text-[13px] text-gray-400">
                      <span className="text-dark-primary">{selectedInvoice.pid}</span>
                      <span>•</span>
                      <span>{selectedInvoice.phone}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-end">
                    <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-1 opacity-60">{t('common_total')}</p>
                    <p className="text-3xl text-white leading-none tracking-tighter">
                      {util.formatVND(selectedInvoice.totalAmount)}
                    </p>
                    <p className="text-[11px] text-indigo-400/80 italic mt-2 font-medium">
                      {util.toVietnameseWords(selectedInvoice.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Nội dung Order */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-dark-bg/50 rounded-3xl border border-gray-800 overflow-hidden mb-8">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-800 bg-gray-900/30">
                            <th className="px-6 py-4 text-[12px] text-gray-500 uppercase">{t('payment_table_service')}</th>
                            <th className="px-6 py-4 text-[12px] text-gray-500 uppercase text-center">{t('payment_table_qty')}</th>
                            <th className="px-6 py-4 text-[12px] text-gray-500 uppercase text-right">{t('payment_unit_price')}</th>
                            <th className="px-6 py-4 text-[12px] text-gray-500 uppercase text-right">{t('payment_table_amount')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {selectedInvoice.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                              <td className="px-6 py-5">
                                <p className="text-white font-bold">{item.vaccineName}</p>
                                <p className="text-[11px] text-gray-500 italic mt-0.5">{t('payment_package_injection')}</p>
                              </td>
                              <td className="px-6 py-5 text-center text-gray-300 font-mono">{item.quantity}</td>
                              <td className="px-6 py-5 text-right text-gray-300 font-mono">{util.formatVND(item.unitPrice)}</td>
                              <td className="px-6 py-5 text-right text-white font-mono">{util.formatVND(item.unitPrice * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-indigo-500/5">
                            <td colSpan={3} className="px-6 py-6 text-right text-gray-400 uppercase text-[12px]">{t('payment_total_service_fee')}</td>
                            <td className="px-6 py-6 text-right text-2xl text-white">{util.formatVND(selectedInvoice.totalAmount)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Chọn phương thức thanh toán */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div
                        onClick={() => activeTab === 0 && setPaymentMethod('Cash')}
                        className={`p-6 rounded-2xl border-2 transition-all flex items-center space-x-4 ${paymentMethod === 'Cash' ? 'border-dark-primary bg-dark-primary/5' : 'border-gray-800 hover:border-gray-700'
                          } ${activeTab === 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                      >
                        <div className={`p-3 rounded-xl ${paymentMethod === 'Cash' ? 'bg-dark-primary text-white' : 'bg-gray-800 text-gray-500'}`}>
                          <Wallet size={24} />
                        </div>
                        <div>
                          <p className={`text-sm ${paymentMethod === 'Cash' ? 'text-white' : 'text-gray-400'}`}>{t('payment_methods_cash')}</p>
                          <p className="text-[11px] text-gray-500">{t('payment_methods_cash_desc')}</p>
                        </div>
                      </div>
                      <div
                        onClick={() => activeTab === 0 && setPaymentMethod('Transfer')}
                        className={`p-6 rounded-2xl border-2 transition-all flex items-center space-x-4 ${paymentMethod === 'Transfer' ? 'border-dark-primary bg-dark-primary/5' : 'border-gray-800 hover:border-gray-700'
                          } ${activeTab === 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                      >
                        <div className={`p-3 rounded-xl ${paymentMethod === 'Transfer' ? 'bg-dark-primary text-white' : 'bg-gray-800 text-gray-500'}`}>
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className={`text-sm ${paymentMethod === 'Transfer' ? 'text-white' : 'text-gray-400'}`}>{t('payment_methods_transfer')}</p>
                          <p className="text-[11px] text-gray-500">{t('payment_methods_transfer_desc')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Các tác vụ */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowPreview(true)}
                        className="flex-1 flex items-center justify-center space-x-2 py-5 rounded-2xl bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50 transition-all group border border-indigo-500/30"
                      >
                        <Eye size={20} className="group-hover:scale-110 transition-transform" />
                        <span>{t('payment_actions_preview')}</span>
                      </button>
                      <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center space-x-2 py-5 rounded-2xl bg-gray-800 text-white hover:bg-gray-700 transition-all group border border-gray-700"
                      >
                        <Printer size={20} className="group-hover:scale-110 transition-transform" />
                        <span>{t('payment_actions_print')}</span>
                      </button>
                      <button
                        onClick={handleConfirmPayment}
                        disabled={submitting || activeTab === 1}
                        className="flex-[2] flex items-center justify-center space-x-3 py-5 rounded-2xl bg-dark-primary text-white hover:bg-indigo-600 transition-all text-lg shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {submitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />}
                        <span>{t('payment_actions_confirm')}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AppAlert
        {...alertConfig}
        onClose={() => setAlertConfig((prev: any) => ({ ...prev, isOpen: false }))}
      />
      <AppConfirm
        {...confirmConfig}
        onClose={() => setConfirmConfig((prev: any) => ({ ...prev, isOpen: false }))}
      />

      {/* Component in phiếu thu - Chỉ hiện khi in */}
      <ReceiptPrint invoice={selectedInvoice} />

      {/* Chế độ Xem trước (Preview Overlay) */}
      {showPreview && (
        <div className="preview-overlay no-print" onClick={() => setShowPreview(false)}>
          <div className="preview-content shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -right-16 top-0 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-md"
              title={t('common_close') || 'Close'}
            >
              <X size={32} />
            </button>
            <ReceiptPrint invoice={selectedInvoice} isPreviewLine={true} />
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Calendar className="mr-2 text-dark-primary" size={20} />
                {t('common_select_date')}
              </h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white text-lg focus:ring-2 focus:ring-dark-primary outline-none transition-all"
              />
              <p className="mt-4 text-gray-500 text-[13px] italic text-center">
                {t('common_default_today')}
              </p>
              <button
                onClick={() => setShowDatePicker(false)}
                className="w-full mt-8 bg-dark-primary hover:bg-dark-primary/80 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                {t('common_confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentPage;
