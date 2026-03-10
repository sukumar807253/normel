import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserPage from './pages/UserPage';
import AdminDashboard from './pages/AdminDashboard';

const { Header, Content, Footer } = Layout;

function App() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <div className="logo" style={{ fontWeight: 'bold', fontSize: '18px' }}>Management System</div>
        <Menu
          mode="horizontal"
          selectable={false}
          style={{ minWidth: 300, justifyContent: 'flex-end', borderBottom: 'none' }}
          items={[
            ...(!user ? [
              { key: 'login', label: <Link to="/login">Login</Link> },
              { key: 'signup', label: <Link to="/signup">Signup</Link> },
            ] : []),
            ...(user ? [
              user.role === 'Admin'
                ? { key: 'admin', label: <Link to="/admin">Admin Dashboard</Link> }
                : { key: 'user', label: <Link to="/profile">My Profile</Link> },
              { key: 'logout', label: <Button type="link" onClick={handleLogout} style={{ padding: 0 }}>Logout</Button> },
            ] : []),
          ]}
        />
      </Header>
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={user && user.role === 'User' ? <UserPage user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/admin" element={user && user.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/" element={user ? (user.role === 'Admin' ? <Navigate to="/admin" replace /> : <Navigate to="/profile" replace />) : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Management System ©2024</Footer>
    </Layout>
  );
}

export default App;
