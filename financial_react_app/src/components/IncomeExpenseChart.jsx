// src/components/IncomeExpenseChart.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Mendaftarkan komponen Chart.js yang akan digunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function IncomeExpenseChart({ data }) {
  // Labels untuk sumbu X (bulan)
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  // Data yang akan ditampilkan di grafik
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: data.map(item => item.pemasukan),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Pengeluaran',
        data: data.map(item => item.pengeluaran),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Opsi konfigurasi grafik
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false, // Judul sudah ada di Dashboard.jsx
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp' + value.toLocaleString('id-ID');
          }
        }
      },
    },
  };

  return (
    <Bar options={options} data={chartData} />
  );
}

export default IncomeExpenseChart;