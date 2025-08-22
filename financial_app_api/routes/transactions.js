const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route POST untuk mendapatkan semua transaksi
router.get('/', async (req, res) => {
    const { month, year, sort } = req.query; // Ambil parameter sort
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    let params = [req.user.id];

    if (year) {
        query += ' AND YEAR(transactionDate) = ?';
        params.push(year);
    }
    if (month) {
        query += ' AND MONTH(transactionDate) = ?';
        params.push(month);
    }

    switch (sort) {
        case 'createdAt_asc':
            query += ' ORDER BY createdAt ASC';
            break;
        case 'amount_desc':
            query += ' ORDER BY amount DESC';
            break;
        case 'amount_asc':
            query += ' ORDER BY amount ASC';
            break;
        default:
            query += ' ORDER BY createdAt DESC';
            break;
    }

    try {
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rute POST untuk menambah transaksi baru
router.post('/', async (req, res) => {
    const { transactionDate, transactionType, category, description, amount } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO transactions (transactionDate, transactionType, category, description, amount, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [transactionDate, transactionType, category, description, amount, req.user.id]
        );
        const [newTransaction] = await pool.query('SELECT * FROM transactions WHERE id = ?', [result.insertId]);
        res.status(201).json(newTransaction[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rute PUT untuk mengedit transaksi berdasarkan ID
router.put('/:id', async (req, res) => {
    const { transactionDate, transactionType, category, description, amount } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE transactions SET transactionDate = ?, transactionType = ?, category = ?, description = ?, amount = ? WHERE id = ? AND user_id = ?',
            [transactionDate, transactionType, category, description, amount, req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
        }
        const [updatedTransaction] = await pool.query('SELECT * FROM transactions WHERE id = ?', [req.params.id]);
        res.json(updatedTransaction[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rute DELETE untuk menghapus transaksi berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
        }
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;