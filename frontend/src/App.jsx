import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
// Remove the UserProvider import completely
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Network from './pages/MyNetwork';
import Jobs from './pages/Jobs';
import Messages from './pages/Messages';
import Nav from './components/Nav';

function AppContent() {
  const { authData } = useAuth();
  
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