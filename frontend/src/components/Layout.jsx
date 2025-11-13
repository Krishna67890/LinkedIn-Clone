import React, { useContext, useState } from 'react';
//import { userDataContext } from '../context/userContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsSearch, BsHouse, BsPeople, BsBriefcase, BsPerson } from 'react-icons/bs';
import { FaLinkedin } from "react-icons/fa";
import NotificationBell from './NotificationBell';

function Layout({ children }) {
  const { userData } = useContext(userDataContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Home', href: '/', icon: BsHouse },
    { name: 'My Network', href: '/network', icon: BsPeople },
    { name: 'Jobs', href: '/jobs', icon: BsBriefcase },
    { name: 'Profile', href: '/profile', icon: BsPerson }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <FaLinkedin className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 hidden md:block">LinkedIn</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium hidden md:block">{item.name}</span>
                  </Link>
                );
              })}

              {/* Notifications Bell */}
              <div className="relative">
                <NotificationBell />
              </div>

              {/* User Profile */}
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={userData?.profileImage || "/default-avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                  }}
                />
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  Me
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center flex-1 ${
                  active ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
          
          {/* Notifications for mobile */}
          <div className="flex flex-col items-center justify-center flex-1">
            <NotificationBell />
            <span className="text-xs mt-1">Notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;