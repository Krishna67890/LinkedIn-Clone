// authContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Predefined demo users
const demoUsers = [
  {
    id: 'user_krishna',
    firstName: 'Krishna',
    lastName: 'Patil Rajput',
    userName: 'krishna_patil',
    email: 'krishna.patil@example.com',
    headline: 'Senior Full Stack Developer & Tech Evangelist',
    location: 'Pune, Maharashtra, India',
    profileImage: '',
    coverImage: '',
    company: 'TechSolutions Inc',
    position: 'Senior Full Stack Developer'
  },
  {
    id: 'user_atharva',
    firstName: 'Atharva',
    lastName: 'Patil Rajput',
    userName: 'atharva_patil',
    email: 'atharva.patil@example.com',
    headline: 'Software Engineer & AI/ML Specialist',
    location: 'Mumbai, Maharashtra, India',
    profileImage: '',
    coverImage: '',
    company: 'AI Innovations Ltd',
    position: 'Software Engineer - AI/ML'
  },
  {
    id: 'user_ankush',
    firstName: 'Ankush',
    lastName: 'Khakale',
    userName: 'ankush_khakale',
    email: 'ankush.khakale@example.com',
    headline: 'Frontend Developer & UI/UX Designer',
    location: 'Bangalore, Karnataka, India',
    profileImage: '',
    coverImage: '',
    company: 'DesignTech Systems',
    position: 'Senior Frontend Developer'
  },
  {
    id: 'user_mahesh',
    firstName: 'Mahesh',
    lastName: 'Vispute',
    userName: 'mahesh_vispute',
    email: 'mahesh.vispute@example.com',
    headline: 'Backend Engineer & Database Specialist',
    location: 'Hyderabad, Telangana, India',
    profileImage: '',
    coverImage: '',
    company: 'DataSystems Pvt Ltd',
    position: 'Lead Backend Engineer'
  }
];

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

  // Function to get demo user by email
  const getDemoUserByEmail = (email) => {
    return demoUsers.find(user => user.email === email);
  };

  // Function to get all demo users
  const getAllDemoUsers = () => {
    return demoUsers;
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
    getDemoUserByEmail,
    getAllDemoUsers,
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

<<<<<<< HEAD:frontend/src/context/AuthContext.jsx
export default AuthProvider; // ✅ Default export
=======
// Export demo users data
export { demoUsers };

export default AuthProvider; // ✅ Default export
>>>>>>> 4df3f66 (Updated LinkedIn clone: added News page and modified components):frontend/src/context/authContext.jsx
