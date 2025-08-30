// server.js
// Asegúrate de instalar las dependencias: npm install express cors mysql2
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usamos la versión con promesas para async/await

const app = express();
const port = 9000;

// --- Configuración de la Base de Datos ---
// RECUERDA: Cambia estos valores por los de tu base de datos.
const dbConfig = {
    host: 'localhost',       // o la IP de tu servidor de BD
    user: 'root',            // tu usuario de BD
    password: '',    // tu contraseña de BD
    database: 'riegodb'      // el nombre de la base de datos que creamos
};

// Creamos un "pool" de conexiones para reutilizarlas y mejorar el rendimiento.
const pool = mysql.createPool(dbConfig);

// --- Middlewares ---
app.use(cors());
app.use(express.json()); // para leer JSON en body

// --- Helpers ---
const generarHumedadAleatoria = () => Math.round(Math.random() * (90 - 10) + 10);

// --- Endpoints ---

// GET /api/dispositivos -> lista de todos los dispositivos con su electroválvula
app.get('/api/dispositivos', async (req, res) => {
    try {
        const query = `
            SELECT d.*, e.nombre as nombreElectrovalvula
            FROM Dispositivos d
            LEFT JOIN Electrovalvulas e ON d.electrovalvulaId = e.electrovalvulaId
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener dispositivos:", error);
        res.status(500).json({ error: 'Error en el servidor al consultar dispositivos.' });
    }
});

// GET /api/dispositivos/:id -> detalle de un dispositivo
app.get('/api/dispositivos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const query = `
            SELECT d.*, e.nombre as nombreElectrovalvula
            FROM Dispositivos d
            LEFT JOIN Electrovalvulas e ON d.electrovalvulaId = e.electrovalvulaId
            WHERE d.dispositivoId = ?
        `;
        const [rows] = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Dispositivo no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(`Error al obtener dispositivo ${req.params.id}:`, error);
        res.status(500).json({ error: 'Error en el servidor al consultar el dispositivo.' });
    }
});

// GET /api/dispositivos/:id/mediciones -> todas las mediciones de un dispositivo
app.get('/api/dispositivos/:id/mediciones', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const query = `
            SELECT * FROM Mediciones
            WHERE dispositivoId = ?
            ORDER BY fecha DESC
        `;
        const [rows] = await pool.query(query, [id]);
        res.json(rows);
    } catch (error) {
        console.error(`Error al obtener mediciones para el dispositivo ${req.params.id}:`, error);
        res.status(500).json({ error: 'Error en el servidor al consultar mediciones.' });
    }
});

// GET /api/dispositivos/:id/mediciones/ultima -> la última medición
app.get('/api/dispositivos/:id/mediciones/ultima', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const query = `
            SELECT * FROM Mediciones
            WHERE dispositivoId = ?
            ORDER BY fecha DESC
            LIMIT 1
        `;
        const [rows] = await pool.query(query, [id]);
        res.json(rows.length > 0 ? rows[0] : null);
    } catch (error) {
        console.error(`Error al obtener la última medición para el dispositivo ${req.params.id}:`, error);
        res.status(500).json({ error: 'Error en el servidor al consultar la última medición.' });
    }
});

// GET /api/dispositivos/:id/estado -> estado actual (último log) de la electroválvula asociada
app.get('/api/dispositivos/:id/estado', async (req, res) => {
    try {
        const id = Number(req.params.id);
        // 1. Obtener el dispositivo para saber su electrovalvulaId
        const [dispositivos] = await pool.query('SELECT electrovalvulaId FROM Dispositivos WHERE dispositivoId = ?', [id]);
        if (dispositivos.length === 0) {
            return res.status(404).json({ error: 'Dispositivo no encontrado' });
        }
        const evId = dispositivos[0].electrovalvulaId;

        // 2. Obtener el último log para esa electroválvula
        const [logs] = await pool.query('SELECT apertura, fecha FROM Log_Riegos WHERE electrovalvulaId = ? ORDER BY fecha DESC LIMIT 1', [evId]);

        if (logs.length === 0) {
            return res.json({ apertura: 0, fecha: null }); // Estado por defecto: cerrado
        }
        res.json(logs[0]);
    } catch (error) {
        console.error(`Error al obtener estado para el dispositivo ${req.params.id}:`, error);
        res.status(500).json({ error: 'Error en el servidor al consultar el estado.' });
    }
});

// POST /api/dispositivos/:id/accionar -> Abre o cierra la electroválvula y registra la medición
app.post('/api/dispositivos/:id/accionar', async (req, res) => {
    const connection = await pool.getConnection(); // Usamos una conexión específica para la transacción
    try {
        const id = Number(req.params.id);

        // 1. Verificar que el dispositivo exista y obtener su electrovalvulaId
        const [dispositivos] = await connection.query('SELECT electrovalvulaId FROM Dispositivos WHERE dispositivoId = ?', [id]);
        if (dispositivos.length === 0) {
            return res.status(404).json({ error: 'Dispositivo no encontrado' });
        }
        const electrovalvulaId = dispositivos[0].electrovalvulaId;

        // 2. Determinar la acción de apertura
        let apertura;
        if (req.body && typeof req.body.apertura !== 'undefined') {
            apertura = Number(req.body.apertura) ? 1 : 0;
        } else if (req.body && req.body.accion) {
            apertura = req.body.accion === 'abrir' ? 1 : 0;
        } else {
            // Comportamiento por defecto: invertir el último estado
            const [lastLog] = await connection.query('SELECT apertura FROM Log_Riegos WHERE electrovalvulaId = ? ORDER BY fecha DESC LIMIT 1', [electrovalvulaId]);
            const ultimoEstado = lastLog.length > 0 ? lastLog[0].apertura : 0;
            apertura = ultimoEstado ? 0 : 1; // Invertir
        }

        const fecha = req.body && req.body.fecha ? new Date(req.body.fecha) : new Date();
        const valor = (req.body && typeof req.body.valor !== 'undefined') ? req.body.valor : generarHumedadAleatoria();

        // 3. Iniciar transacción para asegurar que ambas inserciones se completen
        await connection.beginTransaction();

        // 4. Insertar el log de riego
        const logQuery = 'INSERT INTO Log_Riegos (apertura, fecha, electrovalvulaId) VALUES (?, ?, ?)';
        const [logResult] = await connection.query(logQuery, [apertura, fecha, electrovalvulaId]);
        const nuevoLogId = logResult.insertId;

        // 5. Insertar la nueva medición
        const medicionQuery = 'INSERT INTO Mediciones (fecha, valor, dispositivoId) VALUES (?, ?, ?)';
        const [medicionResult] = await connection.query(medicionQuery, [fecha, valor, id]);
        const nuevaMedicionId = medicionResult.insertId;

        // 6. Si todo fue bien, confirmar la transacción
        await connection.commit();

        // 7. Preparar la respuesta
        const respuesta = {
            message: 'Acción registrada correctamente',
            log: { logRiegoId: nuevoLogId, apertura, fecha, electrovalvulaId },
            medicion: { medicionId: nuevaMedicionId, fecha, valor, dispositivoId: id },
            estado: { apertura, fecha }
        };

        res.status(201).json(respuesta);

    } catch (error) {
        await connection.rollback(); // Si algo falla, deshacer todos los cambios
        console.error(`Error al accionar el dispositivo ${req.params.id}:`, error);
        res.status(500).json({ error: 'Error en el servidor al registrar la acción.' });
    } finally {
        connection.release(); // Siempre liberar la conexión al final
    }
});


// GET /api/log_riegos -> Ver todos los logs para depuración
app.get('/api/log_riegos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Log_Riegos ORDER BY fecha DESC');
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener logs:", error);
        res.status(500).json({ error: 'Error en el servidor al consultar los logs.' });
    }
});

// Health check
app.get('/api/ping', (req, res) => res.json({ pong: true, time: new Date() }));

// Levantar servidor
app.listen(port, () => {
    console.log(`API backend conectado a la base de datos y corriendo en http://localhost:${port}/api`);
});
