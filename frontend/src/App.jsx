import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Network from './pages/MyNetwork';
import Jobs from './pages/Jobs';
import Messages from './pages/Messages';
import News from './pages/News';
import Nav from './components/Nav';

function AppContent() {
  const { authData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle 404 redirects for client-side routing
    const validRoutes = ['/', '/login', '/signup', '/profile', '/notifications', '/network', '/jobs', '/messages', '/news'];
    if (!validRoutes.includes(location.pathname)) {
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <div className="App">
      {authData.isAuthenticated && <Nav />}
      <Routes>
        <Route
          path="/login"
          element={!authData.isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authData.isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={authData.isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authData.isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={authData.isAuthenticated ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/network"
          element={authData.isAuthenticated ? <Network /> : <Navigate to="/login" />}
        />
        <Route
          path="/jobs"
          element={authData.isAuthenticated ? <Jobs /> : <Navigate to="/login" />}
        />
        <Route
          path="/messages"
          element={authData.isAuthenticated ? <Messages /> : <Navigate to="/login" />}
        />
        <Route
          path="/news"
          element={authData.isAuthenticated ? <News /> : <Navigate to="/login" />}
        />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;