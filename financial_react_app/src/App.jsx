// src/App.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transaksi from './pages/Transaksi';
import Anggaran from './pages/Anggaran';
import Profil from './pages/Profil';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthContext, { AuthProvider } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat...</p>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const hideSidebar = ['/login', '/register'].includes(location.pathname) || !isAuthenticated;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {!hideSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <div className={`${hideSidebar ? 'w-full' : (isSidebarOpen ? 'ml-64' : 'ml-20')} flex-1 p-6 transition-all duration-300`}>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/transaksi" element={<PrivateRoute><Transaksi /></PrivateRoute>} />
            <Route path="/anggaran" element={<PrivateRoute><Anggaran /></PrivateRoute>} />
            <Route path="/profil" element={<PrivateRoute><Profil /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;