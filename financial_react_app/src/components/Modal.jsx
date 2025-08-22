import React from 'react';

// Komponen Modal untuk menampilkan konten dalam dialog
// Komponen ini menerima props show, onClose, dan children
function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      {/* Overlay untuk menutup modal ketika diklik di luar konten */}
      <div 
        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full m-4"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutupnya
      >
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;