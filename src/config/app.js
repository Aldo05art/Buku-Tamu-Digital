// src/config/app.js
const express = require('express');
const routerApi = require('../routes/api'); // Import router utama
const errorHandler = require('../middlewares/errorHandler'); // Import middleware error handling
const swaggerUi = require('swagger-ui-express'); // Import Swagger UI
const YAML = require('yamljs'); // Untuk membaca file YAML
const path = require('path'); // Untuk manipulasi path file
const fs = require('fs'); // Untuk operasi file system (menulis JSON)

const app = express();

// Middleware dasar Express
app.use(express.json()); // Mengizinkan Express untuk mem-parse JSON body dari request

// Root API router
// Semua rute akan diakses melalui /api/
app.use('/api', routerApi);

// Swagger Documentation setup
// Path ke swagger.yaml berada di root folder proyek
const swaggerYamlPath = path.join(__dirname, '../../swagger.yaml');
let swaggerDocument;

try {
    swaggerDocument = YAML.load(swaggerYamlPath); // Memuat spesifikasi OpenAPI dari file YAML
    // Pastikan folder src/docs ada
    const docsDirPath = path.join(__dirname, '../docs');
    if (!fs.existsSync(docsDirPath)){
        fs.mkdirSync(docsDirPath, { recursive: true });
    }
    // Menulis spesifikasi OpenAPI ke file JSON di src/docs/api-specs.json
    const apiSpecsPath = path.join(docsDirPath, 'api-specs.json');
    fs.writeFileSync(apiSpecsPath, JSON.stringify(swaggerDocument, null, 2));
    console.log(`Swagger spec generated to ${apiSpecsPath}`);
} catch (e) {
    console.error('Failed to load or generate Swagger spec:', e.message);
    swaggerDocument = {}; // Fallback jika ada error saat memuat/generate spec
}

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Digital Guestbook API!',
        version: '1.0.0',
        docs: '/api-docs'
    });
});

// Menyediakan Swagger UI di endpoint /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handling middleware
// Ini harus ditempatkan setelah semua rute lain dan middleware normal
app.use(errorHandler);

// Mengekspor instance aplikasi Express
module.exports = app;