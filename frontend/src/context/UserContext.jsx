import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// Named export for UserContext
export { UserContext };

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // Initialize user data from localStorage on app load
  useEffect(() => {
    const initializeUserData = () => {
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        try {
          const parsedUser = JSON.parse(demoUser);
          setUserData(parsedUser);
        } catch (error) {
          console.error('Failed to parse user data from localStorage:', error);
        }
      }
    };

    initializeUserData();
  }, []);

  // Update localStorage whenever userData changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('demoUser', JSON.stringify(userData));
    } else if (localStorage.getItem('demoUser')) {
      // If userData is null but localStorage has data, keep localStorage
      // This prevents clearing data unintentionally
    }
  }, [userData]);

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
