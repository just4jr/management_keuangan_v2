// src/pages/Register.jsx (Updated)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    birth_month: '',
    birth_year: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.birth_date || !formData.birth_month || !formData.birth_year) {
      Swal.fire('Gagal!', 'Tanggal lahir harus diisi lengkap.', 'error');
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      Swal.fire('Gagal!', 'Kata sandi tidak cocok.', 'error');
      return;
    }
    if (formData.password.length < 8) {
      Swal.fire('Gagal!', 'Kata sandi minimal 8 karakter.', 'error');
      return;
    }

    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone_number,
      birth_date: `${formData.birth_year}-${formData.birth_month}-${formData.birth_date}`,
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Berhasil!', 'Registrasi berhasil! Silakan login.', 'success');
        setFormData({
          first_name: '',
          last_name: '',
          birth_date: '',
          birth_month: '',
          birth_year: '',
          email: '',
          phone_number: '',
          password: '',
          password_confirmation: '',
        });
        navigate('/login');
      } else {
        Swal.fire('Gagal!', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Gagal!', 'Terjadi kesalahan saat registrasi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const dates = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4 md:p-6">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Buat Akun Baru</h2>
          <p className="mt-2 text-gray-500">Isi detail Anda untuk memulai.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">Nama Depan</label>
              <input 
                type="text" 
                id="first_name" 
                name="first_name" 
                value={formData.first_name}
                required 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Nama Belakang</label>
              <input 
                type="text" 
                id="last_name" 
                name="last_name" 
                value={formData.last_name}
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
            <div className="grid grid-cols-3 gap-3">
              <select
                id="birth_date"
                name="birth_date"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.birth_date}
              >
                <option value="" disabled>Tanggal</option>
                {dates.map((date) => <option key={date} value={date}>{date}</option>)}
              </select>
              <select
                id="birth_month"
                name="birth_month"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.birth_month}
              >
                <option value="" disabled>Bulan</option>
                {months.map((month) => <option key={month} value={month}>{month}</option>)}
              </select>
              <select
                id="birth_year"
                name="birth_year"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.birth_year}
              >
                <option value="" disabled>Tahun</option>
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
            <input type="email" id="email" name="email" value={formData.email} required placeholder="email@contoh.com" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} pattern="[0-9]{10,15}" placeholder="Contoh: 081234567890" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input type="password" id="password" name="password" value={formData.password} required minLength="8" placeholder="Minimal 8 karakter" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
            <input type="password" id="password_confirmation" name="password_confirmation" value={formData.password_confirmation} required placeholder="Ulangi kata sandi" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600 text-sm">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;