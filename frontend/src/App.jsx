import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Common components
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import Loading from './components/common/Loading';
import Sidebar from './components/common/Sidebar';

// Pages
import Analysis from './pages/Analysis';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialization logic that might be needed before rendering
    setInitialized(true);
  }, []);

  if (!initialized) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="dashboard-layout">
                    <Header />
                    <div className="content-with-sidebar">
                      <Sidebar />
                      <div className="main-content">
                        <Dashboard />
                      </div>
                    </div>
                    <Footer />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/analysis/*" element={
                <ProtectedRoute>
                  <div className="dashboard-layout">
                    <Header />
                    <div className="content-with-sidebar">
                      <Sidebar />
                      <div className="main-content">
                        <Analysis />
                      </div>
                    </div>
                    <Footer />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <div className="dashboard-layout">
                    <Header />
                    <div className="content-with-sidebar">
                      <Sidebar />
                      <div className="main-content">
                        <Reports />
                      </div>
                    </div>
                    <Footer />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/settings/*" element={
                <ProtectedRoute>
                  <div className="dashboard-layout">
                    <Header />
                    <div className="content-with-sidebar">
                      <Sidebar />
                      <div className="main-content">
                        <Settings />
                      </div>
                    </div>
                    <Footer />
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;