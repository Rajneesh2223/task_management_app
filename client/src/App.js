import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import AddNewTask from './components/AddNewTask';
import Dashboard from './components/Dashboard';
import EditTask from './components/EditTask';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import TaskList from './components/TaskList';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router> {/* Wrap with BrowserRouter */}
      <AuthProvider> {/* Wrap with your AuthProvider if needed */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/add" element={<AddNewTask />} />
            <Route path="/tasks/edit" element={<EditTask />} />
          </Route>

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
