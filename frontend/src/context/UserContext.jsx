import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);


  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Export ALL possible hook names
export const useUser = () => useContext(UserContext);
export const useUserData = () => useContext(UserContext);
export const useUserContext = () => useContext(UserContext);

// Default export
export default UserContext;
