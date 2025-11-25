// authContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) { // ✅ Named export
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    user: null,
    token: null
  });

  const [serverUrl] = useState("http://localhost:8000");

  // Demo login function
  const demoLogin = (userData) => {
    console.log('🔄 Demo login called with:', userData);
    
    const userWithToken = {
      ...userData,
      token: `demo-token-${Date.now()}`
    };
    
    setAuthData({
      isAuthenticated: true,
      user: userWithToken,
      token: userWithToken.token
    });

    // Store in localStorage for persistence
    localStorage.setItem('demoUser', JSON.stringify(userWithToken));
    localStorage.setItem('demoToken', userWithToken.token);
    
    console.log('✅ Demo login successful');
  };

  // Demo logout function
  const demoLogout = () => {
    setAuthData({
      isAuthenticated: false,
      user: null,
      token: null
    });
    
    // Clear localStorage
    localStorage.removeItem('demoUser');
    localStorage.removeItem('demoToken');
  };

  // Check for existing demo session on app load
  useEffect(() => {
    const demoUser = localStorage.getItem('demoUser');
    const demoToken = localStorage.getItem('demoToken');
    
    if (demoUser && demoToken) {
      setAuthData({
        isAuthenticated: true,
        user: JSON.parse(demoUser),
        token: demoToken
      });
    }
  }, []);

  const value = {
    authData,
    setAuthData,
    serverUrl,
    demoLogin,
    demoLogout,
    login: demoLogin,
    logout: demoLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() { // ✅ Named export
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider; // ✅ Default export
