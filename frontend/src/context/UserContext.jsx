import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  return (
    <UserContext value={{ userData, setUserData }}>
      {children}
    </UserContext>
  );
};

