import { useState } from 'react';
import { useAuth, UserRole } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { AppointmentDetails } from './pages/AppointmentDetails';
import { Clients } from './pages/Clients';
import { Inventory } from './pages/Inventory';
import { Login } from './pages/Login';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fdfdfd]">
        <div className="w-12 h-12 border-4 border-[#005bb7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#f8fafc]">
        <Sidebar />
        <main className="flex-1 lg:ml-72 p-4 lg:p-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments/:id" element={<AppointmentDetails />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
