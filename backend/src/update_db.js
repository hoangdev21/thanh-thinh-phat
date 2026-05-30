const mysql = require('../node_modules/mysql2/promise');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'thanh_thinh_phat'
};

const hash = '$2b$10$wQA0Q86IMV9lzIjQPpsJMuokV0DMWVxknSt1fQL6vhiA0/RMOi66e';

async function update() {
  try {
    const conn = await mysql.createConnection(config);
    await conn.execute('UPDATE admins SET password = ? WHERE username = ?', [hash, 'admin']);
    console.log('Successfully updated admin password in DB with the exact literal hash.');
    
    const [rows] = await conn.execute('SELECT * FROM admins');
    console.log('Verified database content after update:', rows[0]);
    
    await conn.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

update();
