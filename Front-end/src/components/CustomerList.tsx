import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, User as UserIcon, Phone, MapPin, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Customer } from '@/types';
import api from '@/web-configs/api';

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onSelectCustomer }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/customer', {
        params: {
          searchTerm,
          page,
          pageSize: 10
        }
      });
      if (response.data.success) {
        setCustomers(response.data.data.items);
        setTotalPages(response.data.data.totalPages);
        setTotalItems(response.data.data.totalItems);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, user?.token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchCustomers]);

  return (
    <div className="flex flex-col h-full bg-dark-card border border-gray-800 rounded-2xl overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-800 space-y-4 bg-dark-card/50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center">
            <UserIcon className="mr-2 text-dark-primary" size={20} />
            {t('existing_customers')}
          </h3>
          <span className="text-[12px] font-medium text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md border border-gray-700/50 italic">
            {t('double_click_load')}
          </span>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-dark-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder={t('search_customer') || 'Search customer...'}
            className="w-full bg-dark-bg border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-dark-primary focus:ring-1 focus:ring-dark-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <Loader2 className="animate-spin text-dark-primary" size={32} />
            <p className="text-xs text-gray-500 animate-pulse">{t('loading')}</p>
          </div>
        ) : customers.length > 0 ? (
          <div className="divide-y divide-gray-800/50">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="p-4 hover:bg-dark-primary/[0.03] cursor-pointer transition-all duration-200 group relative border-l-2 border-l-transparent hover:border-l-dark-primary"
                onDoubleClick={() => onSelectCustomer(customer)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] font-bold font-mono text-dark-primary bg-dark-primary/10 px-2 py-0.5 rounded border border-dark-primary/20">
                      {customer.pid}
                    </span>
                    <span className={`text-[12px] font-bold px-1.5 py-0.5 rounded ${customer.gender === 'Nam' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'
                      }`}>
                      {customer.gender}
                    </span>
                  </div>
                  <span className="text-[12px] text-gray-500 font-medium">
                    {new Date(customer.dob).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                  {customer.fullName}
                </h4>

                <div className="mt-3 grid grid-cols-1 gap-1.5">
                  <div className="flex items-center text-[11px] text-gray-400 group-hover:text-gray-300 transition-colors">
                    <Phone size={12} className="mr-2 text-dark-primary/60" />
                    {customer.phone || 'Chưa có SĐT'}
                  </div>
                  <div className="flex items-start text-[11px] text-gray-400 group-hover:text-gray-300 transition-colors">
                    <MapPin size={12} className="mr-2 mt-0.5 text-dark-primary/60" />
                    <span className="line-clamp-1">{customer.address}</span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={16} className="text-dark-primary" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            <UserIcon size={48} className="opacity-20" />
            <p>Không tìm thấy khách hàng</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Tổng: <strong>{totalItems}</strong>
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-gray-300">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
