import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './authContext';

export const UserContext = createContext();

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
};

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { serverUrl } = useAuth();

  // ... your context logic

  return (
    <UserContext.Provider value={{ userData, setUserData, edit, setEdit, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;