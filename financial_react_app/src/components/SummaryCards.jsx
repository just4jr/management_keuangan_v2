import React from 'react';
import { FaMoneyBillWave, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Fungsi untuk memformat angka menjadi format rupiah
// Fungsi ini akan digunakan untuk menampilkan total pemasukan, pengeluaran, dan sisa uang
// Format ini akan menambahkan simbol IDR dan memisahkan ribuan dengan titik
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
};

// Komponen SummaryCards untuk menampilkan ringkasan total pemasukan, pengeluaran, dan sisa uang
// Komponen ini menerima props summaryData yang berisi total pemasukan, pengeluaran, dan sisa uang
// Setiap kartu menampilkan informasi dengan ikon dan format rupiah
function SummaryCards({ summaryData }) {
  const cards = [
    {
      title: 'Total Pemasukan',
      value: formatRupiah(summaryData.totalPemasukan),
      icon: <FaArrowUp className="text-green-500" />,
      color: 'bg-green-100',
    },
    {
      title: 'Total Pengeluaran',
      value: formatRupiah(summaryData.totalPengeluaran),
      icon: <FaArrowDown className="text-red-500" />,
      color: 'bg-red-100',
    },
    {
      title: 'Sisa Uang',
      value: formatRupiah(summaryData.sisaUang),
      icon: <FaMoneyBillWave className="text-blue-500" />,
      color: 'bg-blue-100',
    },
  ];

  return (
    // Grid untuk menampilkan kartu ringkasan
    // Setiap kartu menampilkan total pemasukan, pengeluaran, dan sisa uang
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, index) => (
        <div key={index} className={`flex items-center p-4 rounded-lg shadow-md ${card.color}`}>
          <div className="text-3xl mr-4">{card.icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;