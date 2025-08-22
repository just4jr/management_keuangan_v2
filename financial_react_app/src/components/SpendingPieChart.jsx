import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Warna untuk setiap kategori pengeluaran
// Warna ini akan digunakan untuk membedakan setiap kategori dalam pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A6', '#19FF5C', '#19B7FF'];

// Komponen SpendingPieChart untuk menampilkan grafik pie pengeluaran
// Komponen ini menerima props data yang berisi informasi pengeluaran per kategori
function SpendingPieChart({ data }) {
  // Fungsi untuk memformat nilai rupiah pada tooltip
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Komponen untuk menampilkan tooltip khusus
  // Komponen ini akan menampilkan nama kategori dan total pengeluaran
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-gray-600">Total: {formatRupiah(value)}</p>
        </div>
      );
    }
    return null;
  };

  // Fungsi untuk menampilkan label di dalam pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    // Menggabungkan nama kategori dan persentase
    const labelText = `${name} - ${(percent * 100).toFixed(0)}%`;

    // Pastikan label hanya ditampilkan jika persentasenya lebih dari 5%
    if (percent > 0.05) {
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {labelText}
        </text>
      );
    }
    return null;
  };
  
  // Tampilkan pesan jika tidak ada data pengeluaran
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        <p>Tidak ada data pengeluaran untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120} // Memperbesar radius agar lebih jelas
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default SpendingPieChart;