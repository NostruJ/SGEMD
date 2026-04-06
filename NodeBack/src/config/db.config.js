const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_segmed',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
};

console.log('DB Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database
});

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos exitosa');
        connection.release();
        return true;
    } catch (error) {
        console.error('Error conectando a la base de datos:', error.message);
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};
