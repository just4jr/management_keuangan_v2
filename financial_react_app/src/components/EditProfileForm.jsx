import React, { useState, useEffect } from 'react';

// Komponen EditBudgetForm untuk mengedit anggaran
// Komponen ini menerima props budget, onSave, dan onClose
function EditProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    birth_date: ''
  });

  useEffect(() => {
    // Memuat data pengguna ke dalam state saat komponen pertama kali dimuat
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number || '',
        birth_date: user.birth_date ? user.birth_date.split('T')[0] : ''
      });
    }
  }, [user]);

  // Fungsi untuk menangani perubahan input
  // Fungsi ini akan memperbarui state formData ketika input berubah
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Fungsi untuk menangani pengiriman form
  // Fungsi ini akan mencegah perilaku default form dan memanggil onSave
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input untuk nama depan */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium mb-1 text-gray-700">Nama Depan</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Input untuk nama belakang */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium mb-1 text-gray-700">Nama Belakang</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      {/* Input untuk email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      {/* Input untuk nomor telepon dan tanggal lahir */}
      {/* Ini memungkinkan pengguna untuk memperbarui informasi kontak mereka */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium mb-1 text-gray-700">Nomor Telepon</label>
          <input
            type="tel"
            name="phone_number"
            id="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Input untuk tanggal lahir */}
        {/* Ini memungkinkan pengguna untuk menentukan tanggal lahir mereka */}
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium mb-1 text-gray-700">Tanggal Lahir</label>
          <input
            type="date"
            name="birth_date"
            id="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {/* Tombol untuk mengirim form atau membatalkan */}
      {/* Tombol ini akan memanggil onCancel ketika pengguna ingin membatalkan pengeditan profil */}
      {/* Tombol ini akan memanggil onSave ketika pengguna ingin menyimpan perubahan */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;