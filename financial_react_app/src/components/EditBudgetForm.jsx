// src/components/EditBudgetForm.jsx

import React, { useState, useEffect } from 'react';

function EditBudgetForm({ budget, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: '',
    category: '',
    amount: '',
    type: ''
  });

  useEffect(() => {
    // Memuat data anggaran ke dalam state saat komponen pertama kali dirender
    // atau saat prop 'budget' berubah
    if (budget) {
      setFormData({
        id: budget.id,
        category: budget.category,
        amount: budget.amount,
        type: budget.type,
      });
    }
  }, [budget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}

export default EditBudgetForm;