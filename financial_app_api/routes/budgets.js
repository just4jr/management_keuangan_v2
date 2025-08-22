const express = require('express');
const router = express.Router();
const pool = require('../db');
const { protect } = require('../middleware/auth');

// Middleware untuk melindungi rute
// Semua rute di bawah ini akan memerlukan otentikasi pengguna
router.use(protect); 

// Rute GET untuk semua anggaran
router.get('/', async (req, res) => {
    try {
        const [budgets] = await pool.query('SELECT * FROM budgets WHERE user_id = ? ORDER BY createdAt DESC', [req.user.id]);
        const [transactions] = await pool.query('SELECT * FROM transactions WHERE user_id = ?', [req.user.id]); // Mengambil semua transaksi

        const totalPengeluaran = transactions
            .filter(t => t.transactionType === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expensesByCategory = transactions
            .filter(t => t.transactionType === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
                return acc;
            }, {});

        const budgetsWithUsed = budgets.map(b => {
            if (b.type === 'expense') {
                const used = expensesByCategory[b.category] || 0;
                return {
                    ...b,
                    used: used,
                    sisa: b.amount - used
                };
            } else if (b.type === 'income') {
                const used = totalPengeluaran;
                return {
                    ...b,
                    used: used,
                    sisa: b.amount - used
                };
            }
            return b;
        });

        res.json(budgetsWithUsed);
    } catch (err) {
        console.error('Error in /budgets GET:', err);
        res.status(500).json({ message: err.message });
    }
});

// Rute POST untuk menambah anggaran baru
router.post('/', protect, async (req, res) => {
    const { category, amount, type } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO budgets (category, amount, used, type, user_id) VALUES (?, ?, ?, ?, ?)',
            [category, amount, 0, type, req.user.id]
        );
        const [newBudget] = await pool.query('SELECT * FROM budgets WHERE id = ?', [result.insertId]);
        res.status(201).json(newBudget[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rute PUT untuk mengedit anggaran berdasarkan ID
router.put('/:id', protect, async (req, res) => {
    const { category, amount } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE budgets SET category = ?, amount = ? WHERE id = ? AND user_id = ?',
            [category, amount, req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Anggaran tidak ditemukan.' });
        }
        const [updatedBudget] = await pool.query('SELECT * FROM budgets WHERE id = ?', [req.params.id]);
        res.json(updatedBudget[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rute DELETE untuk menghapus anggaran berdasarkan ID
router.delete('/:id', protect, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM budgets WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Anggaran tidak ditemukan.' });
        }
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;