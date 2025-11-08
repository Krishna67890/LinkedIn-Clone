// components/RouteTester.jsx
import React, { useContext } from 'react';
import axios from 'axios';
import { authDataContext } from '../context/authContext';

const RouteTester = () => {
  const { serverUrl } = useContext(authDataContext);

  const testRoutes = async () => {
    const endpoints = [
      '/api/post/test',
      '/api/post/test-public',
      '/api/post/user-posts',
      '/api/post/all'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing: ${endpoint}`);
        const response = await axios.get(serverUrl + endpoint, {
          withCredentials: true
        });
        console.log(`✅ ${endpoint}:`, response.data);
      } catch (error) {
        console.error(`❌ ${endpoint}:`, error.response?.data || error.message);
      }
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <button onClick={testRoutes} style={{ padding: '10px 20px' }}>
        Test Post Routes
      </button>
    </div>
  );
};

export default RouteTester;