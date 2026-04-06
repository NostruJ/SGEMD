const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  const pool = mysql.createPool({
    host: 'sgemd-db',
    user: 'root',
    password: 'rootpassword',
    database: 'db_segmed'
  });

  const hash = bcrypt.hashSync('admin123', 10);
  console.log('Hash:', hash);

  await pool.execute('UPDATE usuarios SET Password = ? WHERE idUsuarios = ?', [hash, 7]);
  console.log('Password updated');

  const [rows] = await pool.execute('SELECT Password FROM usuarios WHERE idUsuarios = 7');
  console.log('New password in DB:', rows[0].Password);

  pool.end();
}

updatePassword().catch(console.error);
