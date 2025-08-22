import React, { useState, useEffect } from 'react';

// Komponen EditTransactionForm untuk mengedit transaksi
// Komponen ini menerima props transaction, onSave, onClose, dan categories
function EditTransactionForm({ transaction, onSave, onClose, categories }) {
  const [formData, setFormData] = useState({
    id: '',
    transactionDate: '',
    transactionType: '',
    category: '',
    amount: '',
    description: '',
  });

  // Memuat data transaksi ke dalam state saat komponen pertama kali dimuat
  // atau saat prop 'transaction' berubah
  useEffect(() => {
    if (transaction) {
      setFormData({
        id: transaction.id,
        transactionDate: transaction.transactionDate.split('T')[0], // Memastikan format tanggal benar
        transactionType: transaction.transactionType,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
      });
    }
  }, [transaction]);

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
  // Fungsi ini akan mencegah perilaku default form dan memanggil onSave
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
        {/* Dropdown untuk memilih kategori transaksi */}
        {/* Ini memungkinkan pengguna memilih kategori yang sesuai dengan transaksi mereka */}
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
        {/* Input untuk deskripsi transaksi */}
        {/* Ini memungkinkan pengguna untuk memberikan keterangan tambahan tentang transaksi */}
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
      {/* Tombol untuk mengirim form atau membatalkan */}
      {/* Tombol ini akan memanggil onClose ketika pengguna ingin membatalkan pengeditan transaksi */}
      {/* Tombol ini akan memanggil onSave ketika pengguna ingin menyimpan perubahan */}
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
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}

export default EditTransactionForm;