import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  ArrowUpRight,
  Loader2,
  Calendar,
  Layers,
  Activity,
  Box,
  ChevronRight,
  TrendingDown,
  X,
  FileSpreadsheet,
  Upload
} from 'lucide-react';
import util from '@/web-configs/util';
import { RootState } from '@/store';
import { VaccineInventory } from '@/types';
import api from '@/web-configs/api';
import { AppAlert } from '@/components/AppDialogs';

interface ImportData {
  vaccineId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: string;
}

const InventoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [inventory, setInventory] = useState<VaccineInventory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineInventory | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importData, setImportData] = useState<ImportData>({ vaccineId: '', batchNumber: '', expiryDate: '', quantity: '' });
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Excel Import State
  const [showExcelModal, setShowExcelModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importingExcel, setImportingExcel] = useState<boolean>(false);

  // Search Vaccine in Select State
  const [searchVaccine, setSearchVaccine] = useState<string>('');
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

  const [alertConfig, setAlertConfig] = useState<any>({ isOpen: false, title: '', message: '', type: 'info' });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vaccine/inventory');
      if (response.data.success) {
        setInventory(response.data.data);
      }
    } catch (error) {
      console.error('Fetch inventory error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importData.vaccineId || !importData.batchNumber || !importData.expiryDate || !importData.quantity) {
      setAlertConfig({ isOpen: true, type: 'warning', title: t('common_confirm') || 'Confirm', message: t('common_missing_info') || 'Missing fields' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/vaccine/import', {
        ...importData,
        quantity: parseInt(importData.quantity)
      });

      if (response.data.success) {
        setShowImportModal(false);
        setImportData({ vaccineId: '', batchNumber: '', expiryDate: '', quantity: '' });
        setSearchVaccine('');
        fetchInventory();
      }
    } catch (error) {
      setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: t('inventory_import_failed') || 'Import failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportExcel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setImportingExcel(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/vaccine/import-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setShowExcelModal(false);
        setSelectedFile(null);
        fetchInventory();
      }
    } catch (error) {
      setAlertConfig({ isOpen: true, type: 'error', title: 'Error', message: t('inventory_excel_failed') || 'Excel import failed' });
    } finally {
      setImportingExcel(false);
    }
  };

  const filteredInventory = inventory.filter((v: VaccineInventory) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalItems: inventory.length,
    lowStock: inventory.filter((v: VaccineInventory) => v.totalStock < 20).length,
    expiringSoon: inventory.reduce((acc, v) => acc + v.batches.filter(b => {
      const days = (new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
      return days > 0 && days < 30;
    }).length, 0),
    outOfStock: inventory.filter((v: VaccineInventory) => v.totalStock === 0).length
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 px-4 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl text-white tracking-tight flex items-center">
            <Package className="mr-3 text-dark-primary" size={32} />
            {t('inventory_title').toUpperCase()}
          </h1>
          <p className="text-gray-500 mt-1">{t('inventory_subtitle')}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowExcelModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95"
          >
            <FileSpreadsheet size={20} />
            <span>{t('import_excel_btn')}</span>
          </button>
          <button
            onClick={() => {
              setImportData(prev => ({ ...prev, vaccineId: inventory[0]?.id || '' }));
              setSearchVaccine('');
              setShowImportModal(true);
            }}
            className="bg-dark-primary hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            <span>{t('import_manual_btn')}</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Box className="text-blue-400" />}
          title={t('total_types')}
          value={stats.totalItems}
          subtitle={t('total_types_info')}
        />
        <StatCard
          icon={<TrendingDown className="text-orange-400" />}
          title={t('low_stock')}
          value={stats.lowStock}
          subtitle={t('low_stock_info')}
          isWarning={stats.lowStock > 0}
        />
        <StatCard
          icon={<Calendar className="text-red-400" />}
          title={t('expiring_soon')}
          value={stats.expiringSoon}
          subtitle={t('expiring_soon_info')}
          isWarning={stats.expiringSoon > 0}
        />
        <StatCard
          icon={<AlertTriangle className="text-gray-400" />}
          title={t('out_of_stock')}
          value={stats.outOfStock}
          subtitle={t('out_of_stock_info')}
          isCritical={stats.outOfStock > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-380px)]">
        {/* Left: Vaccine List */}
        <div className="lg:col-span-8 flex flex-col bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center text-white">
            <h3 className="text-[15px]  flex items-center font-sans tracking-wider uppercase">
              <Layers className="mr-2 text-dark-primary" size={20} />
              {t('inventory_title')}
            </h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder={t('common_search_placeholder') || 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-bg border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-xs text-gray-300 outline-none focus:border-dark-primary transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <Loader2 className="animate-spin text-dark-primary" size={32} />
                <p className="text-xs text-gray-500">{t('common_loading')}</p>
              </div>
            ) : filteredInventory.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-900 z-10">
                  <tr className="border-b border-gray-800">
                    <th className="p-5 text-[12px] text-gray-500 uppercase">{t('inventory_table_vaccine_name')}</th>
                    <th className="p-5 text-[12px] text-gray-500 uppercase text-center">{t('inventory_table_total_stock')}</th>
                    <th className="p-5 text-[12px] text-gray-500 uppercase text-center">{t('inventory_table_batch_count')}</th>
                    <th className="p-5 text-[12px] text-gray-500 uppercase text-right">{t('inventory_table_price')}</th>
                    <th className="p-5 text-[12px] text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredInventory.map((item: VaccineInventory) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedVaccine(item)}
                      className={`group hover:bg-gray-800/40 cursor-pointer transition-colors ${selectedVaccine?.id === item.id ? 'bg-indigo-500/5' : ''}`}
                    >
                      <td className="p-5">
                        <p className="text-[15px] font-medium text-gray-200 group-hover:text-dark-primary transition-colors">{item.name}</p>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 italic">{item.description}</p>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[13px] ${item.totalStock > 20 ? 'bg-green-500/10 text-green-400' : item.totalStock > 0 ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                          {item.totalStock} {t('inventory_doses')}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-gray-400 text-[13px]">{item.batches.length} {t('inventory_batches')}</span>
                      </td>
                      <td className="p-5 text-right font-mono text-[14px] text-indigo-300">
                        {util.formatVND(item.price)}
                      </td>
                      <td className="p-5 text-right">
                        <ChevronRight size={18} className={`text-gray-700 group-hover:text-dark-primary transition-all ${selectedVaccine?.id === item.id ? 'translate-x-1' : ''}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-30 p-20 text-center">
                <Package size={64} className="mb-4" />
                <p>{t('common_no_data')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chi tiết lô hàng */}
        <div className="lg:col-span-4 flex flex-col bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-gray-800 bg-gray-900/50 text-white">
            <h3 className="text-[15px]  flex items-center tracking-wider uppercase">
              <Activity className="mr-2 text-dark-primary" size={20} />
              {t('inventory_batch_detail_title')}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {selectedVaccine ? (
              <div className="space-y-6">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-dark-primary/10 rounded-full -mr-12 -mt-12"></div>
                  <h4 className="text-[13px] text-indigo-400 uppercase mb-1">{t('inventory_batch_detail_selected_vaccine')}</h4>
                  <p className="text-lg text-white leading-tight">{selectedVaccine.name}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[12px] text-gray-500 uppercase tracking-widest pl-1">{t('inventory_batch_detail_list_title')}</p>
                  {selectedVaccine.batches.map((batch) => (
                    <div
                      key={batch.batchId}
                      className={`p-4 rounded-xl border transition-all ${new Date(batch.expiryDate) < new Date() ? 'bg-red-500/5 border-red-500/30' : 'bg-gray-800/50 border-gray-700/50'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[11px] text-gray-500 uppercase">{t('inventory_batch_detail_batch_number')}</p>
                          <p className="text-[16px] font-mono text-dark-primary">{batch.batchNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-gray-500 uppercase">{t('inventory_batch_detail_quantity')}</p>
                          <p className={`text-[16px] ${batch.quantityInStock > 0 ? 'text-white' : 'text-red-500'}`}>
                            {batch.quantityInStock} {t('inventory_doses')}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                        <div className="flex items-center text-[13px] text-gray-400">
                          <Calendar size={14} className="mr-1.5" />
                          {t('inventory_batch_detail_expiry')}: {new Date(batch.expiryDate).toLocaleDateString('vi-VN')}
                        </div>
                        {new Date(batch.expiryDate).getTime() < new Date().getTime() ? (
                          <span className="text-[11px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded">{t('inventory_batch_detail_expired')}</span>
                        ) : (new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) < 30 ? (
                          <span className="text-[11px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded">{t('inventory_batch_detail_expiring_soon')}</span>
                        ) : (
                          <span className="text-[11px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded">{t('inventory_batch_detail_safe')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <Plus size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm italic">{t('inventory_batch_detail_select_prompt')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-dark-card border border-gray-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl text-white flex items-center tracking-tight">
                <Plus className="mr-2 text-dark-primary" size={24} />
                {t('inventory_import_modal_title')}
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleImport} className="p-8 space-y-6">
              <div className="space-y-2 relative">
                <label className="text-[12px] text-gray-500 uppercase tracking-wider">{t('inventory_import_modal_select_vaccine')}</label>
                <div
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className="w-full bg-dark-bg border border-gray-700 rounded-2xl p-4 text-white outline-none focus:border-dark-primary cursor-pointer flex justify-between items-center"
                >
                  <span className={importData.vaccineId ? 'text-white' : 'text-gray-500'}>
                    {inventory.find(v => v.id == importData.vaccineId)?.name || `-- ${t('inventory_import_modal_select_vaccine_placeholder')} --`}
                  </span>
                  <ChevronRight size={18} className={`transition-transform ${isSelectOpen ? 'rotate-90' : ''}`} />
                </div>

                {isSelectOpen && (
                  <div className="absolute z-[60] left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-3 border-b border-gray-800 bg-gray-900">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                          type="text"
                          placeholder={`${t('common_search')} ${t('menu_vaccines').toLowerCase()}...`}
                          value={searchVaccine}
                          onChange={(e) => setSearchVaccine(e.target.value)}
                          className="w-full bg-dark-bg border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-300 outline-none focus:border-dark-primary"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {inventory.filter(v => v.name.toLowerCase().includes(searchVaccine.toLowerCase())).map(v => (
                        <div
                          key={v.id}
                          onClick={() => {
                            setImportData(prev => ({ ...prev, vaccineId: v.id }));
                            setIsSelectOpen(false);
                          }}
                          className={`p-4 text-sm cursor-pointer hover:bg-gray-800 transition-colors ${importData.vaccineId == v.id ? 'bg-indigo-500/10 text-dark-primary' : 'text-gray-300'}`}
                        >
                          {v.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[12px] text-gray-500 uppercase tracking-wider">Số lô (Batch Number)</label>
                  <input
                    type="text"
                    placeholder="VD: VN2024-001"
                    value={importData.batchNumber}
                    onChange={(e) => setImportData(prev => ({ ...prev, batchNumber: e.target.value }))}
                    className="w-full bg-dark-bg border border-gray-700 rounded-2xl p-4 text-white outline-none focus:border-dark-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] text-gray-500 uppercase tracking-wider">Số lượng nhập (liều)</label>
                  <input
                    type="number"
                    placeholder="VD: 500"
                    value={importData.quantity}
                    onChange={(e) => setImportData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full bg-dark-bg border border-gray-700 rounded-2xl p-4 text-white outline-none focus:border-dark-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] text-gray-500 uppercase tracking-wider">Hạn sử dụng</label>
                <input
                  type="date"
                  value={importData.expiryDate}
                  onChange={(e) => setImportData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full bg-dark-bg border border-gray-700 rounded-2xl p-4 text-white outline-none focus:border-dark-primary transition-all"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-4 rounded-2xl transition-all"
                >
                  {t('common_cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-dark-primary hover:bg-indigo-600 text-white py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? <Loader2 className="animate-spin" size={24} /> : t('inventory_import_modal_confirm_btn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-dark-card border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl text-white flex items-center tracking-tight">
                <FileSpreadsheet className="mr-2 text-green-500" size={24} />
                {t('inventory_excel_modal_title')}
              </h3>
              <button
                onClick={() => setShowExcelModal(false)}
                className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleImportExcel} className="p-8 space-y-6">
              <div
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${selectedFile ? 'border-green-500 bg-green-500/5' : 'border-gray-700 hover:border-dark-primary bg-gray-900/50'}`}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              >
                <Upload className={`mb-4 ${selectedFile ? 'text-green-500' : 'text-gray-500'}`} size={48} />
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-gray-500 text-[11px] mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-400 text-[12px] mt-4 hover:underline"
                    >
                      {t('inventory_excel_modal_reselect_file')}
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-300">{t('inventory_excel_modal_drag_drop')}</p>
                    <p className="text-gray-500 text-[11px] mt-2">{t('inventory_excel_modal_supported_formats')}</p>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFile(file);
                      }}
                      className="hidden"
                      id="excel-upload"
                    />
                    <label
                      htmlFor="excel-upload"
                      className="mt-6 inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-xl text-sm cursor-pointer transition-all"
                    >
                      {t('inventory_excel_modal_select_file')}
                    </label>
                  </div>
                )}
              </div>

              <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                <p className="text-[12px] text-gray-500 mb-2 font-bold uppercase tracking-widest">{t('inventory_excel_modal_file_format_note')}</p>
                <ul className="text-[11px] text-gray-400 space-y-1.5 list-disc pl-4">
                  <li>{t('inventory_excel_modal_note_header_row')}</li>
                  <li>{t('inventory_excel_modal_note_required_cols')} <span className="text-gray-200">VaccineName, BatchNumber, ExpiryDate, Quantity</span>.</li>
                  <li>{t('inventory_excel_modal_note_match_name')}</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowExcelModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-4 rounded-2xl transition-all"
                >
                  {t('common_cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || importingExcel}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {importingExcel ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      <FileSpreadsheet size={20} />
                      <span>{t('inventory_excel_modal_start_import')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AppAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev: any) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  isWarning?: boolean;
  isCritical?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, isWarning, isCritical }) => (
  <div className={`p-6 rounded-3xl border transition-all shadow-lg hover:translate-y-[-2px] ${isCritical ? 'bg-red-500/5 border-red-500/20' :
    isWarning ? 'bg-orange-500/5 border-orange-500/20' :
      'bg-dark-card border-gray-800'
    }`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-800/50 rounded-2xl">{icon}</div>
      <ArrowUpRight className="text-gray-700" size={20} />
    </div>
    <h3 className="text-gray-500 text-[13px] uppercase tracking-wider">{title}</h3>
    <div className="flex items-baseline mt-1 space-x-2">
      <p className="text-3xl text-white">{value}</p>
    </div>
    <p className="text-[11px] text-gray-600 mt-2 italic">{subtitle}</p>
  </div>
);

export default InventoryPage;
