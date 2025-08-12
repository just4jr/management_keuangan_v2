// middleware/auth.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Periksa apakah token ada di header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari header "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Simpan data pengguna yang ada di dalam token ke objek request
            req.user = decoded; 

            next();
        } catch (error) {
            return res.status(403).json({ message: 'Token tidak valid.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Tidak ada token, otorisasi ditolak.' });
    }
};

module.exports = { protect };