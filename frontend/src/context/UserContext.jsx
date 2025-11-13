import React from 'react';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  return children;
};

export const useUser = () => {
  return { userData: null, setUserData: () => {} };
};