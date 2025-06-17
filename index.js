// index.js
require('dotenv').config(); // Load environment variables di awal

// Mengimpor aplikasi Express dari lokasi yang sudah diperbaiki
const app = require('./src/config/app');

// Mengambil port dan environment dari environment variables atau menggunakan nilai default
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

// Menjalankan server Express
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${ENV} mode`);
    console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});