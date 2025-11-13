// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NotificationBell } from '../pages/Notifications';
//import { userDataContext } from '../context/userContext';
import { authDataContext } from '../context/authContext';

function Header() {
  const { userData } = useContext(userDataContext);
  const { logout } = useContext(authDataContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <span className="text-xl font-bold text-gray-900">LinkedIn</span>
          </Link>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex flex-col items-center space-y-1 ${
                location.pathname === '/' ? 'text-gray-900' : 'text-gray-600'
              } hover:text-gray-900 transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">Home</span>
            </Link>

            <Link 
              to="/network" 
              className={`flex flex-col items-center space-y-1 ${
                location.pathname === '/network' ? 'text-gray-900' : 'text-gray-600'
              } hover:text-gray-900 transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs">My Network</span>
            </Link>

            <Link 
              to="/notifications" 
              className={`flex flex-col items-center space-y-1 ${
                location.pathname === '/notifications' ? 'text-gray-900' : 'text-gray-600'
              } hover:text-gray-900 transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">Notifications</span>
            </Link>
          </nav>

          {/* Right side - Notification Bell & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Profile Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <img
                  src={userData?.profileImage || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {userData?.firstName || 'Profile'}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link 
                  to="/profile" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b transition-colors"
                >
                  View Profile
                </Link>
                <Link 
                  to="/edit-profile" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b transition-colors"
                >
                  Edit Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;