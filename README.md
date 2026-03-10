# Management System

This is a Full-Stack Management System built with React (Ant Design), Node.js (Express), and PostgreSQL.

## Features
- **Authentication**: Sign up and Login.
- **User Profile**: Update Name, Mobile, and upload a single document.
- **Admin Dashboard**: View all members, edit their details, delete them, and view their uploaded document.

## Prerequisites
- Node.js installed
- PostgreSQL installed and running locally

## Setup Instructions

### 1. Database Setup
1. Ensure your local PostgreSQL is running on port 5432 using the default credentials (`user`: postgres, `password`: postgres). If not, update `backend/db.js` with your credentials.
2. Open a terminal in the `backend` folder and run the initialization script to create the database and tables automatically:
   ```bash
   cd backend
   npm install
   node init_db.js
   ```
   *(This will also create a default Admin user: `admin@example.com` / `admin123`)*

### 2. Run the Backend
1. In the `backend` folder terminal, run:
   ```bash
   node server.js
   ```
   *The server will start on http://localhost:5000*

### 3. Run the Frontend
1. Open a **new** terminal, navigate to the `frontend` folder.
2. Install the necessary packages (Note: this might take a minute):
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will open on http://localhost:5173*

## Tech Stack
- **Frontend**: Vite + React, Ant Design, Axios, React Router.
- **Backend**: Node.js, Express, pg (PostgreSQL), Multer (for file uploads).
