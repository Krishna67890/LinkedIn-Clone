import React, { useState, useContext, useEffect, createContext } from 'react';
import axios from 'axios';
import { AuthContext } from '/src/context/authContext.jsx';

// Create context
export const userDataContext = createContext();

// Create custom hook
export const useUserData = () => {
  const context = useContext(userDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
};

// Provider component
export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { serverUrl } = useContext(AuthContext);

  const getCurrentUser = async () => {
    try {
      console.log('🔍 Checking if user is logged in...');
      const result = await axios.get(`${serverUrl}/api/user/currentuser`, {
        withCredentials: true
      });
      
      if (result.data.success) {
        console.log('✅ User is logged in:', result.data.user);
        setUserData(result.data.user);
      } else {
        console.log('ℹ️ No user data received');
        setUserData(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('ℹ️ No user logged in (this is normal)');
      } else {
        console.error('❌ Error checking user:', error);
      }
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serverUrl) {
      console.log('🔄 Initializing user context with server:', serverUrl);
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [serverUrl]);

  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    loading,
    refreshUser: getCurrentUser
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserProvider;