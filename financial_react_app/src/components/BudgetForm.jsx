import React, { useState } from 'react';

// Komponen BudgetForm untuk menambahkan anggaran
// Komponen ini menerima props onSubmit untuk menangani pengiriman form
function BudgetForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    type: 'expense' // Tambahkan state untuk tipe
  });

  // Fungsi untuk menangani perubahan input
  // Fungsi ini akan memperbarui state formData ketika input berubah
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fungsi untuk menangani pengiriman form
  // Fungsi ini akan mencegah perilaku default form dan memanggil onSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Render form untuk menambahkan anggaran
  // Form ini terdiri dari input untuk kategori, jumlah, dan tipe anggaran
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input untuk kategori anggaran */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">Nama Kategori</label>
        <input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      {/* Input untuk jumlah anggaran */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">Jumlah Anggaran</label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      {/* Dropdown untuk memilih tipe anggaran (Pengeluaran/Pemasukan) */}
      {/* Ini memungkinkan pengguna memilih apakah anggaran ini untuk pengeluaran atau pemasukan */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">Jenis Kategori</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
        </select>
      </div>
      {/* Tombol untuk mengirim form atau membatalkan */}
      {/* Tombol ini akan memanggil onClose ketika pengguna ingin membatalkan penambahan anggaran */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Tambah
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;