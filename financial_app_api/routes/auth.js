// routes/auth.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// Rute POST untuk registrasi pengguna baru
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone_number, birth_date } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (first_name, last_name, email, password, phone_number, birth_date) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, phone_number, birth_date]
        );
        res.status(201).json({ message: 'Registrasi berhasil!' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email sudah terdaftar.' });
        }
        res.status(500).json({ message: err.message });
    }
});

// Rute POST untuk login pengguna
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ message: 'Email atau kata sandi salah.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email atau kata sandi salah.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/profile', protect, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, first_name, last_name, email, phone_number, birth_date, created_at, foto_profil FROM users WHERE id = ?', [req.user.id]);
        if (!users[0]) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rute PUT untuk memperbarui profil pengguna
router.put('/profile', protect, async (req, res) => {
    const { first_name, last_name, email, phone_number, birth_date } = req.body;
    try {
        await pool.query(
            'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, birth_date = ? WHERE id = ?',
            [first_name, last_name, email, phone_number, birth_date, req.user.id]
        );
        
        const [updatedUser] = await pool.query('SELECT id, first_name, last_name, email, phone_number, birth_date, created_at FROM users WHERE id = ?', [req.user.id]);

        if (updatedUser.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.json(updatedUser[0]);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email sudah terdaftar.' });
        }
        console.error("Error updating user profile:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;