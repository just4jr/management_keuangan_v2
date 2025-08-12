// src/pages/Profil.jsx (Perubahan pada bagian return)

import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';
import EditProfileForm from '../components/EditProfileForm';

function Profil() {
  const { token, user: loggedInUser, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const fetchUserProfile = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data profil.');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Gagal mengambil data profil:", error);
      Swal.fire('Gagal!', 'Terjadi kesalahan saat mengambil data profil.', 'error');
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsLoading(false);
    } else {
      fetchUserProfile();
    }
  }, [loggedInUser, token]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto_profil', file);

    Swal.fire({
      title: 'Ganti Foto?',
      text: "Foto profil Anda akan diperbarui.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, ganti!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost:5000/api/profile/photo', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (!response.ok) {
            throw new Error('Gagal mengunggah foto.');
          }

          const data = await response.json();
          setUser(prevUser => ({ ...prevUser, foto_profil: data.foto_profil }));
          Swal.fire('Berhasil!', 'Foto profil berhasil diubah.', 'success');
        } catch (error) {
          console.error("Gagal mengunggah foto:", error);
          Swal.fire('Gagal!', 'Terjadi kesalahan saat mengunggah foto.', 'error');
        }
      }
    });
  };

  const handleSaveProfile = async (updatedData) => {
    Swal.fire({
      title: 'Simpan Perubahan?',
      text: "Data profil Anda akan diperbarui.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, simpan!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData),
          });

          if (!response.ok) {
            throw new Error('Gagal memperbarui profil di server.');
          }

          setUser(updatedData);
          setIsEditing(false);
          Swal.fire('Berhasil!', 'Profil berhasil diperbarui.', 'success');
        } catch (error) {
          Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui profil.', 'error');
        }
      }
    });
  };

  if (isLoading || !user) {
    return (
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg h-full text-gray-800 p-6 flex justify-center items-center">
          <p>Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6">
      <div className="bg-white shadow-md rounded-lg h-full text-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Profil Akun</h2>

        {isEditing ? (
          <EditProfileForm
            user={user}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              <div className="relative w-40 h-40 flex-shrink-0">
                <img
                  src={user.foto_profil || 'https://via.placeholder.com/150'}
                  alt="Foto Profil"
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <i className="bi bi-camera-fill text-lg"></i>
                  <input
                    type="file"
                    name="foto_profil"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="w-full">
                <h3 className="text-3xl font-bold text-gray-900">{user.first_name} {user.last_name}</h3>
                <p className="text-lg text-gray-500 mb-4">{user.email}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-200"
                >
                  Edit Profil
                </button>
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card untuk Nama Lengkap */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 font-medium mb-1">Nama Lengkap</p>
                <p className="text-lg text-gray-800 font-semibold">{user.first_name} {user.last_name}</p>
              </div>

              {/* Card untuk Email */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 font-medium mb-1">Email</p>
                <p className="text-lg text-gray-800 font-semibold">{user.email}</p>
              </div>

              {/* Card untuk Nomor Telepon */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 font-medium mb-1">Nomor Telepon</p>
                <p className="text-lg text-gray-800 font-semibold">{user.phone_number || '-'}</p>
              </div>

              {/* Card untuk Tanggal Lahir */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 font-medium mb-1">Tanggal Lahir</p>
                <p className="text-lg text-gray-800 font-semibold">{formatDate(user.birth_date)}</p>
              </div>

              {/* Card untuk Tanggal Daftar */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 font-medium mb-1">Tanggal Daftar</p>
                <p className="text-lg text-gray-800 font-semibold">{formatDate(user.created_at)}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Profil;