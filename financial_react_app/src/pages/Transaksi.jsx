// src/pages/Transaksi.jsx (Revised)

import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import Modal from '../components/Modal';
import SummaryCards from '../components/SummaryCards';
import SpendingPieChart from '../components/SpendingPieChart';
import TransactionForm from '../components/TransactionForm';
import EditTransactionForm from '../components/EditTransactionForm';
import AuthContext from '../context/AuthContext';

function Transaksi() {
  const { token } = useContext(AuthContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [summary, setSummary] = useState({ totalPemasukan: 0, totalPengeluaran: 0, sisaUang: 0 }); // Sesuai dengan backend
  const [pieChartData, setPieChartData] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // State untuk filter
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  // State baru untuk pengurutan
  const [selectedSort, setSelectedSort] = useState('createdAt_desc');

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // Menggabungkan logika pengambilan transaksi dan data pie chart
  const fetchTransactions = async () => {
    if (!token) return;

    let filterQuery = '';
    if (selectedYear) {
      filterQuery += `&year=${selectedYear}`;
    }
    if (selectedMonth) {
      filterQuery += `&month=${selectedMonth}`;
    }
    if (selectedSort) {
      filterQuery += `&sort=${selectedSort}`;
    }
    const url = `http://localhost:5000/api/transactions?${filterQuery.substring(1)}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data transaksi.');
      }
      const data = await response.json();
      setTransactions(data);

      // Logika baru: Membuat data pie chart langsung dari data transaksi yang sudah difilter
      const expenseSummary = data
        .filter(t => t.transactionType === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
          return acc;
        }, {});
      
      const pieData = Object.keys(expenseSummary).map(key => ({ name: key, value: expenseSummary[key] }));
      setPieChartData(pieData);

    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data.', 'error');
    }
  };

  const fetchSummaryData = async () => {
    if (!token) return;
    
    // API Summary sekarang menerima filter bulan/tahun dari frontend
    let filterQuery = '';
    if (selectedYear) {
      filterQuery += `&year=${selectedYear}`;
    }
    if (selectedMonth) {
      filterQuery += `&month=${selectedMonth}`;
    }
    const url = `http://localhost:5000/api/dashboard/summary?${filterQuery.substring(1)}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data ringkasan.');
      }
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Gagal mengambil data summary:", error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data ringkasan.', 'error');
    }
  };

  const fetchBudgets = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/budgets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data anggaran.');
      }
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Gagal mengambil data anggaran:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchSummaryData();
      fetchBudgets();
    }
  }, [token, selectedMonth, selectedYear, selectedSort]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setTransactionToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleAddTransaction = async (newTransaction) => {
    Swal.fire({
      title: 'Tambahkan Transaksi?',
      text: "Anda akan menambahkan transaksi baru ini.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, tambah!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost:5000/api/transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newTransaction),
          });

          if (!response.ok) {
            throw new Error('Gagal menambahkan transaksi ke server.');
          }

          Swal.fire('Berhasil!', 'Transaksi berhasil ditambahkan.', 'success');
          fetchTransactions();
          fetchSummaryData();
          closeAddModal();
        } catch (error) {
          console.error("Gagal menambahkan transaksi:", error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan transaksi.', 'error');
        }
      }
    });
  };

  const handleUpdateTransaction = async (updatedTransaction) => {
    Swal.fire({
      title: 'Simpan Perubahan?',
      text: "Data transaksi akan diperbarui.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, simpan!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/transactions/${updatedTransaction.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedTransaction),
          });

          if (!response.ok) {
            throw new Error('Gagal memperbarui transaksi di server.');
          }
          
          Swal.fire('Berhasil!', 'Transaksi berhasil diperbarui.', 'success');
          fetchTransactions();
          fetchSummaryData();
          closeEditModal();
        } catch (error) {
          console.error("Gagal memperbarui transaksi:", error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui transaksi.', 'error');
        }
      }
    });
  };

  const handleDeleteTransaction = async (id) => {
    Swal.fire({
      title: 'Hapus Transaksi?',
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Gagal menghapus transaksi dari server.');
          }

          Swal.fire('Terhapus!', 'Transaksi berhasil dihapus.', 'success');
          fetchTransactions();
          fetchSummaryData();
        } catch (error) {
          console.error("Gagal menghapus transaksi:", error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus transaksi.', 'error');
        }
      }
    });
  };

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const sortOptions = [
    { label: 'Tanggal Terbaru', value: 'createdAt_desc' },
    { label: 'Tanggal Terlama', value: 'createdAt_asc' },
    { label: 'Jumlah Terbesar', value: 'amount_desc' },
    { label: 'Jumlah Terkecil', value: 'amount_asc' },
  ];
  
  // Menggunakan categories dari budgets
  const categories = budgets.map(b => b.category);

  return (
    <div className="p-4">
      <SummaryCards summaryData={summary} details={['Dari Semua Kategori', 'Bulan Ini', 'Sisa dari Anggaran Total']} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Ringkasan Pengeluaran</h2>
        <button onClick={openAddModal} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <i className="bi bi-plus-circle mr-2"></i> Tambah Transaksi Baru
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Pengeluaran per Kategori</h3>
        <SpendingPieChart data={pieChartData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Riwayat Transaksi</h2>
          <div className="flex space-x-2">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Bulan</option>
              {months.map((month, index) => (
                <option key={index} value={String(index + 1).padStart(2, '0')}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tahun</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${item.transactionType === 'expense' ? 'bg-red-100' : 'bg-green-100'}`}>
                    <i className={`bi ${item.transactionType === 'expense' ? 'bi-arrow-down text-red-600' : 'bi-arrow-up text-green-600'}`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.transactionDate} - {item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${item.transactionType === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                    {item.transactionType === 'expense' ? '-' : '+'}{formatRupiah(item.amount)}
                  </p>
                  <div className="mt-1">
                    <button onClick={() => openEditModal(item)} className="text-gray-500 hover:text-blue-600 mr-2"><i className="bi bi-pencil-square"></i></button>
                    <button onClick={() => handleDeleteTransaction(item.id)} className="text-gray-500 hover:text-red-600"><i className="bi bi-trash"></i></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Tidak ada transaksi yang ditemukan.</p>
          )}
        </div>
      </div>
      
      <Modal show={isAddModalOpen} onClose={closeAddModal}>
        <h2 className="text-xl font-semibold mb-4">Transaksi Baru</h2>
        <TransactionForm onSubmit={handleAddTransaction} onClose={closeAddModal} categories={budgets} />
      </Modal>

      {transactionToEdit && (
        <Modal show={isEditModalOpen} onClose={closeEditModal}>
          <h2 className="text-xl font-semibold mb-4">Edit Transaksi</h2>
          <EditTransactionForm
            transaction={transactionToEdit}
            onSave={handleUpdateTransaction}
            onClose={closeEditModal}
            categories={budgets}
          />
        </Modal>
      )}
    </div>
  );
}

export default Transaksi;