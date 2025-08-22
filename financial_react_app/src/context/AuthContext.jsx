// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Membuat konteks untuk otentikasi
// Kode ini akan menyediakan state otentikasi dan fungsi untuk login/logout
const AuthContext = createContext();

// Komponen AuthProvider untuk menyediakan konteks otentikasi
// Komponen ini akan membungkus aplikasi dan menyediakan state otentikasi
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Efek untuk memeriksa status otentikasi saat komponen dimuat
  // Ini akan memeriksa apakah ada token yang tersimpan di localStorage
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Gagal memparsing data pengguna:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  // Fungsi untuk login
  // Fungsi ini akan menyimpan token dan data pengguna ke localStorage
  // dan memperbarui state otentikasi
  const login = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/');
  };

  // Fungsi untuk logout
  // Fungsi ini akan menghapus token dan data pengguna dari localStorage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;