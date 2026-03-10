-- Database: management_db

-- Connect to your database if needed (e.g., \c management_db)

-- Drop table if it exists to start fresh (WARNING: This deletes all data!)
-- DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    file_url TEXT,
    role VARCHAR(50) DEFAULT 'User'
);

-- Indexes for performance (optional but good practice)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a default Admin user (Password is 'admin123' - you should hash this in production)
INSERT INTO users (name, mobile, email, password, role) 
VALUES ('Admin User', '0000000000', 'admin@example.com', 'admin123', 'Admin')
ON CONFLICT (email) DO NOTHING;
