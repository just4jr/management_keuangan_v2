// src/pages/Anggaran.jsx

import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import SummaryCards from '../components/SummaryCards';
import Modal from '../components/Modal';
import BudgetForm from '../components/BudgetForm';
import EditBudgetForm from '../components/EditBudgetForm';
import AuthContext from '../context/AuthContext';

function Anggaran() {
  const { token } = useContext(AuthContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [summary, setSummary] = useState({ totalPemasukan: 0, totalPengeluaran: 0, sisaAnggaran: 0 });

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
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
        throw new Error('Gagal mengambil data anggaran dari server.');
      }
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Gagal mengambil data anggaran:", error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data.', 'error');
    }
  };

  const fetchSummaryData = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/summary', {
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

  useEffect(() => {
    if (token) {
      fetchBudgets();
      fetchSummaryData();
    }
  }, [token]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (budget) => {
    setBudgetToEdit(budget);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setBudgetToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleAddBudget = async (newBudget) => {
    Swal.fire({
      title: 'Tambahkan Anggaran?',
      text: "Anda akan menambahkan anggaran baru ini.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, tambah!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost:5000/api/budgets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newBudget),
          });

          if (!response.ok) {
            throw new Error('Gagal menambahkan anggaran ke server.');
          }

          Swal.fire('Berhasil!', 'Anggaran berhasil ditambahkan.', 'success');
          fetchBudgets();
          fetchSummaryData();
          closeAddModal();
        } catch (error) {
          console.error("Gagal menambahkan anggaran:", error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan anggaran.', 'error');
        }
      }
    });
  };

  const handleUpdateBudget = async (updatedBudget) => {
    Swal.fire({
      title: 'Simpan Perubahan?',
      text: "Data anggaran akan diperbarui.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, simpan!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/budgets/${updatedBudget.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedBudget),
          });

          if (!response.ok) {
            throw new Error('Gagal memperbarui anggaran di server.');
          }

          Swal.fire('Berhasil!', 'Anggaran berhasil diperbarui.', 'success');
          fetchBudgets();
          fetchSummaryData();
          closeEditModal();
        } catch (error) {
          console.error("Gagal memperbarui anggaran:", error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui anggaran.', 'error');
        }
      }
    });
  };

  const handleDeleteBudget = async (id) => {
    Swal.fire({
      title: 'Hapus Anggaran?',
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Gagal menghapus anggaran dari server.');
          }

          Swal.fire('Terhapus!', 'Anggaran berhasil dihapus.', 'success');
          fetchBudgets();
          fetchSummaryData();
        } catch (error) {
          console.error("Gagal menghapus anggaran:", error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus anggaran.', 'error');
        }
      }
    });
  };

  const expenses = budgets.filter(b => b.type === 'expense');
  const incomes = budgets.filter(b => b.type === 'income');

  return (
    <div className="p-4">
      <SummaryCards summaryData={summary} details={['Total Pemasukan Anda', 'Total Pengeluaran Anda', 'Sisa Anggaran Anda']} />
      <div className="flex justify-end mb-4">
        <button onClick={openAddModal} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <i className="bi bi-plus-circle mr-2"></i> Tambah Anggaran
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Anggaran Pengeluaran</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {expenses.length > 0 ? (
            expenses.map((budget) => {
              const sisa = budget.amount - budget.used;
              const persentaseTerpakai = (budget.used / budget.amount) * 100;
              return (
                <div key={budget.id} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{budget.category}</h3>
                    <div>
                      <button onClick={() => openEditModal(budget)} className="text-gray-500 hover:text-blue-600 mr-2"><i className="bi bi-pencil-square"></i></button>
                      <button onClick={() => handleDeleteBudget(budget.id)} className="text-gray-500 hover:text-red-600"><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Anggaran: {formatRupiah(budget.amount)}</p>
                  <p className="text-sm text-gray-500">Terpakai: {formatRupiah(budget.used)}</p>
                  <p className="text-sm font-semibold mt-2">Sisa: {formatRupiah(sisa)}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${persentaseTerpakai}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">Belum ada anggaran pengeluaran yang ditambahkan.</p>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Anggaran Pemasukan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {incomes.length > 0 ? (
            incomes.map((budget) => {
              const sisa = budget.amount - budget.used;
              const persentaseTerpakai = (budget.used / budget.amount) * 100;
              return (
                <div key={budget.id} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{budget.category}</h3>
                    <div>
                      <button onClick={() => openEditModal(budget)} className="text-gray-500 hover:text-blue-600 mr-2"><i className="bi bi-pencil-square"></i></button>
                      <button onClick={() => handleDeleteBudget(budget.id)} className="text-gray-500 hover:text-red-600"><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Anggaran: {formatRupiah(budget.amount)}</p>
                  <p className="text-sm text-gray-500">Terpakai: {formatRupiah(budget.used)}</p>
                  <p className="text-sm font-semibold mt-2">Sisa: {formatRupiah(sisa)}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${persentaseTerpakai}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">Belum ada anggaran pemasukan yang ditambahkan.</p>
          )}
        </div>
      </div>
      
      <Modal show={isAddModalOpen} onClose={closeAddModal}>
        <h2 className="text-xl font-semibold text-center mb-4">Tambah Kategori</h2>
        <BudgetForm onSubmit={handleAddBudget} onClose={closeAddModal} />
      </Modal>

      {budgetToEdit && (
        <Modal show={isEditModalOpen} onClose={closeEditModal}>
          <h2 className="text-xl font-semibold text-center mb-4">Edit Anggaran</h2>
          <EditBudgetForm
            budget={budgetToEdit}
            onSave={handleUpdateBudget}
            onClose={closeEditModal}
          />
        </Modal>
      )}

    </div>
  );
}

export default Anggaran;