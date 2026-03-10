require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function initDB() {
  // Directly connect using DATABASE_URL (Render DB already exists)
  const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '123456',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'management_db',
      };

  const pool = new Pool(config);

  try {
    console.log('Creating users table if not exists...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        file_url TEXT,
        role VARCHAR(50) DEFAULT 'User'
      );
    `);

    // Check if admin already exists
    const checkAdmin = await pool.query("SELECT * FROM users WHERE email = 'admin@example.com'");
    if (checkAdmin.rowCount === 0) {
      console.log('Creating default Admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await pool.query(
        "INSERT INTO users (name, mobile, email, password, role) VALUES ($1, $2, $3, $4, $5)",
        ['Admin User', '0000000000', 'admin@example.com', hashedPassword, 'Admin']
      );
      console.log('✅ Admin user created: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('✅ Database initialization complete!');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  } finally {
    await pool.end();
  }
}

initDB();
