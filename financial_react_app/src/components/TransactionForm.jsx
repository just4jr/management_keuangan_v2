import React, { useState } from 'react';

// Komponen TransactionForm untuk menambahkan transaksi
// Komponen ini menerima props onSubmit untuk menangani pengiriman form
function TransactionForm({ onSubmit, onClose, categories }) {
  const [formData, setFormData] = useState({
    transactionDate: '',
    transactionType: '',
    category: '',
    amount: '',
    description: '',
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

  // Filter kategori berdasarkan jenis transaksi
  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.transactionType
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input untuk tanggal transaksi */}
        {/* Ini memungkinkan pengguna untuk menentukan tanggal transaksi mereka */}
        <div>
          <label htmlFor="transactionDate" className="block text-sm font-medium mb-1">Tanggal</label>
          <input
            type="date"
            name="transactionDate"
            id="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Dropdown untuk memilih tipe transaksi (Pemasukan/Pengeluaran) */}
        {/* Ini memungkinkan pengguna memilih apakah transaksi ini adalah pemasukan atau pengeluaran */}
        <div>
          <label htmlFor="transactionType" className="block text-sm font-medium mb-1">Tipe Transaksi</label>
          <select
            name="transactionType"
            id="transactionType"
            value={formData.transactionType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Tipe</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        </div>
        {/* Dropdown untuk memilih kategori berdasarkan tipe transaksi */}
        {/* Ini memungkinkan pengguna memilih kategori yang sesuai dengan tipe transaksi */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Nama atau Jenis Anggaran</label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Pilih Kategori</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.category}>{cat.category}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Input untuk jumlah transaksi */}
      {/* Ini memungkinkan pengguna untuk menentukan jumlah transaksi mereka */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">Jumlah</label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Input untuk keterangan transaksi */}
        {/* Ini memungkinkan pengguna untuk memberikan deskripsi atau keterangan tambahan tentang transaksi */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Keterangan</label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      {/* Tombol untuk menutup form atau mengirim data */}
      {/* Tombol ini akan memanggil onClose ketika pengguna ingin membatalkan penambahan transaksi */}
      {/* Tombol ini juga akan mengirim data transaksi ketika pengguna mengklik tombol "Tambah Transaksi" */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Batal
        </button>
        {/* Tombol untuk mengirim data transaksi */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Tambah Transaksi
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;