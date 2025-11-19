import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Plans from './pages/Plans';
import Dashboard from './pages/Dashboard';
import AdminSubscriptions from './pages/AdminSubscriptions';

function App() {
  return (
    <Provider store={store}>
      <Router>
          <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plans" element={<Plans />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSubscriptions />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
