import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { AppDispatch } from '@/store';
import api from '@/web-configs/api';
import Sidebar from '@/components/Sidebar';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await api.get('/auth/verify');
      } catch (error: any) {
        // Interceptor đã xử lý redirect nếu là 401
        if (error.response?.status === 401 || error.response?.status === 404) {
          dispatch(logout());
          navigate('/login');
        }
      }
    };
    verifyAuth();
  }, [dispatch, navigate]);

  return (
    <div className="flex min-h-screen bg-dark-bg text-dark-text print:bg-white print:text-black">
      <div className="no-print">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
