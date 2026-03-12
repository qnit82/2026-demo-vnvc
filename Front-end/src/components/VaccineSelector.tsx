import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Syringe, ChevronLeft, ChevronRight, Loader2, X, Plus, CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Vaccine } from '@/types';
import api from '@/web-configs/api';

interface VaccineSelectorProps {
  selectedVaccines: Vaccine[];
  onSelectVaccine: (vaccine: Vaccine) => void;
  onRemoveVaccine: (id: string) => void;
}

const VaccineSelector = React.forwardRef<HTMLInputElement, VaccineSelectorProps>(
  ({ selectedVaccines, onSelectVaccine, onRemoveVaccine }, ref) => {
    const { t } = useTranslation();
    const { user } = useSelector((state: RootState) => state.auth);
    const [vaccines, setVaccines] = useState<any[]>([]); // Sử dụng any tạm thời nếu API trả về cấu trúc khác Vaccine core
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);

    const fetchVaccines = useCallback(async () => {
      setLoading(true);
      try {
        const response = await api.get('/vaccine', {
          params: {
            searchTerm,
            page,
            pageSize: 6
          }
        });
        if (response.data.success) {
          setVaccines(response.data.data.items);
          setTotalPages(response.data.data.totalPages);
          setTotalItems(response.data.data.totalItems);
        }
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      } finally {
        setLoading(false);
      }
    }, [searchTerm, page, user?.token]);

    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        fetchVaccines();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }, [fetchVaccines]);

    const totalAmount = selectedVaccines.reduce((sum, v) => sum + v.price, 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
          {/* Left: Vaccines đang có*/}
          <div className="flex flex-col bg-dark-bg border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-gray-800 bg-gray-900/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  ref={ref}
                  type="text"
                  placeholder={t('search_vaccine') || 'Search vaccine...'}
                  className="w-full bg-dark-card border border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:border-dark-primary outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-dark-primary" size={24} />
                </div>
              ) : vaccines.length > 0 ? (
                <div className="divide-y divide-gray-800">
                  {vaccines.map((v) => {
                    const isSelected = selectedVaccines.some(sv => sv.vaccineId === v.id);
                    const vaccineData: Vaccine = {
                      vaccineId: v.id,
                      vaccineName: v.name,
                      price: v.price
                    };
                    return (
                      <div
                        key={v.id}
                        className={`p-3 hover:bg-gray-800 transition-colors flex justify-between items-center group cursor-pointer ${isSelected ? 'bg-dark-primary/5' : ''}`}
                        onClick={() => !isSelected && onSelectVaccine(vaccineData)}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="text-sm font-medium text-white truncate group-hover:text-dark-primary transition-colors">
                            {v.name}
                          </h4>
                          <p className="text-[12px] text-gray-500 truncate">{v.description}</p>
                          <p className="text-[12px] text-dark-primary font-semibold mt-0.5">
                            {v.price.toLocaleString('vi-VN')} VNĐ
                          </p>
                        </div>
                        <button
                          className={`p-1.5 rounded-lg border transition-all ${isSelected
                            ? 'border-dark-primary/20 bg-dark-primary/10 text-dark-primary'
                            : 'border-gray-700 text-gray-500 hover:border-dark-primary hover:text-dark-primary hover:bg-dark-primary/10'
                            }`}
                        >
                          {isSelected ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                  <Syringe size={32} className="opacity-10" />
                  <p className="text-xs">Không tìm thấy vắc xin</p>
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            <div className="p-3 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between">
              <span className="text-[12px] text-gray-500">
                Tổng: <strong>{totalItems}</strong>
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1 rounded border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[12px] font-medium text-gray-300 mx-1">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1 rounded border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Vaccines đã chọn */}
          <div className="flex flex-col bg-dark-bg border border-gray-800 rounded-xl overflow-hidden shadow-lg ring-1 ring-dark-primary/5">
            <div className="p-3 border-b border-gray-800 bg-dark-primary/5 flex justify-between items-center">
              <h3 className="text-xs font-bold text-dark-primary uppercase tracking-wider flex items-center">
                <Syringe size={14} className="mr-2" />
                {t('registration_selected_services')} ({selectedVaccines.length})
              </h3>
              <span className="text-xs font-bold text-white bg-dark-primary px-2 py-0.5 rounded-full">
                {totalAmount.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {selectedVaccines.length > 0 ? (
                <div className="divide-y divide-gray-800/50">
                  {selectedVaccines.map((v) => (
                    <div key={v.vaccineId} className="p-3 flex justify-between items-center animate-in slide-in-from-right-2 duration-200">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-sm font-medium text-white truncate">{v.vaccineName}</h4>
                        <p className="text-[12px] text-dark-primary font-semibold">{v.price.toLocaleString('vi-VN')} VNĐ</p>
                      </div>
                      <button
                        onClick={() => onRemoveVaccine(v.vaccineId)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p className="text-sm">{t('no_data')}</p>
                </div>
              )}
            </div>

            {/* Total Footer */}
            <div className="p-4 bg-dark-primary/10 border-t border-dark-primary/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">{t('subtotal')}:</span>
                <span className="text-xs font-medium text-white">{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white">{t('grand_total')}:</span>
                <span className="text-lg font-bold text-dark-primary">{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VaccineSelector.displayName = 'VaccineSelector';

export default VaccineSelector;
