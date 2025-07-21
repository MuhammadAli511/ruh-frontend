import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Appointments from './pages/Appointments';
import CreateAppointment from './pages/CreateAppointment';
import EditAppointment from './pages/EditAppointment';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route
            path="/clients"
            element={
              <PrivateRoute>
                <Layout>
                  <Clients />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ClientDetails />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <Layout>
                  <Appointments />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments/create"
            element={
              <PrivateRoute>
                <Layout>
                  <CreateAppointment />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments/:id/edit"
            element={
              <PrivateRoute>
                <Layout>
                  <EditAppointment />
                </Layout>
              </PrivateRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/clients" replace />} />
          <Route path="*" element={<Navigate to="/clients" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
