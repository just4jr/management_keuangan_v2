// src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Login berhasil.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate('/');
        });
      } else {
        Swal.fire('Gagal!', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Gagal!', 'Terjadi kesalahan saat login.', 'error');
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-center mb-6">
          <i className="bi bi-person-circle text-4xl text-blue-600 mr-2"></i>
          <h2 className="text-3xl font-bold text-gray-800">Login</h2>
        </div>
        <p className="text-gray-500 mb-8">Selamat datang kembali! Silakan login ke akun Anda.</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-left">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="text-left">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold uppercase tracking-wider
            shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-gray-600">
          Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;