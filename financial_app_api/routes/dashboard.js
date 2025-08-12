// routes/dashboard.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { protect } = require('../middleware/auth');

router.use(protect);

// Rute GET untuk data ringkasan dashboard
router.get('/summary', async (req, res) => {
    const { month, year } = req.query;
    let query = `
        SELECT 
            SUM(CASE WHEN transactionType = 'income' THEN amount ELSE 0 END) AS totalPemasukan,
            SUM(CASE WHEN transactionType = 'expense' THEN amount ELSE 0 END) AS totalPengeluaran
        FROM transactions
        WHERE user_id = ?
    `;
    const params = [req.user.id];

    if (month && year) {
        query += ' AND MONTH(transactionDate) = ? AND YEAR(transactionDate) = ?';
        params.push(month, year);
    } else {
        query += ' AND MONTH(transactionDate) = MONTH(CURRENT_DATE()) AND YEAR(transactionDate) = YEAR(CURRENT_DATE())';
    }

    try {
        console.log('Executing query:', query, params); // Log untuk debugging
        const [summaryResult] = await pool.query(query, params);

        const totalPemasukan = summaryResult[0].totalPemasukan || 0;
        const totalPengeluaran = summaryResult[0].totalPengeluaran || 0;
        const sisaUang = totalPemasukan - totalPengeluaran;

        res.json({
            totalPemasukan,
            totalPengeluaran,
            sisaUang,
        });
    } catch (err) {
        console.error('Error in /dashboard/summary:', err); // Log error spesifik
        res.status(500).json({ message: 'Gagal mengambil data ringkasan.' });
    }
});

// Rute GET untuk data grafik dashboard
router.get('/chart', async (req, res) => {
    try {
        const [results] = await pool.query(
            `SELECT
                MONTH(transactionDate) AS month,
                SUM(CASE WHEN transactionType = 'income' THEN amount ELSE 0 END) AS pemasukan,
                SUM(CASE WHEN transactionType = 'expense' THEN amount ELSE 0 END) AS pengeluaran
            FROM transactions
            WHERE user_id = ? AND YEAR(transactionDate) = YEAR(CURRENT_DATE())
            GROUP BY MONTH(transactionDate)
            ORDER BY month ASC;`,
            [req.user.id]
        );

        const chartData = [];
        for (let i = 1; i <= 12; i++) {
            const existingData = results.find(item => item.month === i);
            chartData.push({
                month: i,
                pemasukan: existingData ? existingData.pemasukan : 0,
                pengeluaran: existingData ? existingData.pengeluaran : 0
            });
        }
        
        res.json(chartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengambil data grafik.' });
    }
});

module.exports = router;