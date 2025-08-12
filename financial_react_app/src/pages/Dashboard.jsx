// src/pages/Dashboard.jsx

import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import SummaryCards from '../components/SummaryCards';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import AuthContext from '../context/AuthContext';

function Dashboard() {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    sisaUang: 0,
  });
  const [chartData, setChartData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      // Mengambil data ringkasan (summary)
      const summaryResponse = await fetch('http://localhost:5000/api/dashboard/summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!summaryResponse.ok) {
        throw new Error('Gagal mengambil data ringkasan.');
      }
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);

      // Mengambil data untuk grafik (chart)
      const chartResponse = await fetch('http://localhost:5000/api/dashboard/chart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!chartResponse.ok) {
        throw new Error('Gagal mengambil data grafik.');
      }
      const chartData = await chartResponse.json();
      setChartData(chartData);

    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data dashboard.', 'error');
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  return (
    <div className="p-4">
      {/* Komponen SummaryCards */}
      <SummaryCards summaryData={summary} />

      {/* Komponen IncomeExpenseChart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Perbandingan Pemasukan & Pengeluaran</h2>
        <IncomeExpenseChart data={chartData} />
      </div>
      
    </div>
  );
}

export default Dashboard;