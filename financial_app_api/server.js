const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Impor file-file rute
const authRouter = require('./routes/auth');
const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');
const dashboardRouter = require('./routes/dashboard');
const { protect } = require('./middleware/auth'); // Import middleware protect

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Hubungkan rute-rute autentikasi
app.use('/api/auth', authRouter);

// Hubungkan rute-rute yang dilindungi
app.use('/api/transactions', protect, transactionsRouter);
app.use('/api/budgets', protect, budgetsRouter);
app.use('/api/dashboard', protect, dashboardRouter);

// Rute untuk menangani kesalahan 404
// Jika tidak ada rute yang cocok, kembalikan 404
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});