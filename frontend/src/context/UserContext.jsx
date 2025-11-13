<<<<<<< HEAD
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

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};

export default UserContext;
=======
// // context/userContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from './authContext';

// export const UserContext = createContext();

// export const useUserData = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUserData must be used within a UserProvider');
//   }
//   return context;
// };

// export function UserProvider({ children }) {
//   const [userData, setUserData] = useState(null);
//   const [edit, setEdit] = useState(false);
//   const [loading, setLoading] = useState(true);
  
//   const { serverUrl } = useAuth();

//   // Add your context logic here
//   // For example:
//   useEffect(() => {
//     // You can add logic to fetch user data on app start
//     // or when authentication changes
//     const fetchUserData = async () => {
//       try {
//         // Your API calls to fetch user data
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [serverUrl]);

//   const value = {
//     userData,
//     setUserData,
//     edit,
//     setEdit,
//     loading
//   };

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export default UserProvider;
>>>>>>> f12fefb0824eaf46a81b38d826dbbbd136b596d6
