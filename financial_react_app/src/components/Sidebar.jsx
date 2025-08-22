import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';

// Komponen Sidebar untuk navigasi aplikasi
// Komponen ini menerima props isOpen dan toggleSidebar untuk mengontrol visibilitas sidebar
function Sidebar({ isOpen, toggleSidebar }) {
  // Menggunakan useNavigate untuk navigasi programatikally
  // Menggunakan useContext untuk mendapatkan fungsi logout dari AuthContext
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Fungsi untuk menangani logout
  // Fungsi ini akan menampilkan konfirmasi sebelum melakukan logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda akan keluar dari akun Anda.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Keluar!',
          'Anda telah berhasil keluar.',
          'success'
        ).then(() => {
          logout();
        });
      }
    });
  };

  // Daftar item navigasi untuk sidebar
  // Setiap item memiliki nama, ikon, dan path untuk navigasi
  const navItems = [
    { name: 'Dashboard', icon: 'bi-house-door', path: '/' },
    { name: 'Transaksi', icon: 'bi-cash-stack', path: '/transaksi' },
    { name: 'Anggaran', icon: 'bi-pie-chart', path: '/anggaran' },
    { name: 'Profil', icon: 'bi-person', path: '/profil' },
  ];

  return (
    <aside
      className={`bg-white shadow-lg z-50 h-screen transition-all duration-300 fixed top-0 left-0 flex flex-col border-r border-gray-200 ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="p-6 flex items-center justify-center relative">
        {/* Konten header ketika sidebar terbuka */}
        {isOpen ? (
          <div className="flex items-center gap-2">
            <i className="bi bi-wallet2 text-2xl text-blue-600"></i>
            <span className="text-xl font-bold text-gray-800">FINE</span>
          </div>
        ) : (
          /* Tombol toggle ketika sidebar dilipat */
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <i className={`bi bi-arrow-right-short text-2xl`}></i>
          </button>
        )}
        
        {/* Tombol toggle untuk menutup sidebar, hanya muncul saat terbuka */}
        {isOpen && (
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <i className="bi bi-arrow-left-short text-2xl"></i>
          </button>
        )}
      </div>
      {/* Navigasi sidebar */}
      {/* Menggunakan NavLink untuk navigasi yang aktif */}
      <nav className="flex-1 px-4 mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 mb-2
              ${isActive ? 'bg-blue-500 text-white font-semibold shadow-md' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <i className={`bi ${item.icon} text-xl ${isOpen ? 'mr-4' : ''}`}></i>
            <span className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 absolute -left-96'}`}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>
      {/* Tombol untuk logout */}
      {/* Tombol ini akan memanggil handleLogout ketika pengguna ingin keluar dari akun */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 rounded-xl transition-all duration-200 w-full text-left
          text-gray-600 hover:bg-gray-100"
        >
          <i className={`bi bi-box-arrow-right text-xl ${isOpen ? 'mr-4' : ''}`}></i>
          <span className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 absolute -left-96'}`}>
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;