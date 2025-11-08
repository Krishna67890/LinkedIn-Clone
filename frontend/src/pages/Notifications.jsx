// src/pages/Notifications.jsx
import React, { useContext, useState, useEffect } from 'react';
import { userDataContext } from '../context/userContext';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaRegBell, FaBell, FaTrash } from "react-icons/fa";

// Notification Bell Component for Header
export function NotificationBell() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('userNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <Link 
        to="/notifications" 
        className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
}

// Main Notifications Page Component
function Notifications() {
  const { userData } = useContext(userDataContext);
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);

  // Sample notifications data - replace with actual data from your backend
  const sampleNotifications = [
    {
      _id: 1,
      title: 'Connection Request',
      message: 'John Doe wants to connect with you',
      type: 'connection_request',
      isRead: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      color: 'blue',
      icon: '👋',
      user: {
        profileImage: '/default-avatar.png',
        firstName: 'John',
        lastName: 'Doe'
      },
      actionRequired: true
    },
    {
      _id: 2,
      title: 'Post Liked',
      message: 'Jane Smith liked your post about React development',
      type: 'like',
      isRead: true,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      color: 'red',
      icon: '❤️',
      user: {
        profileImage: '/default-avatar.png',
        firstName: 'Jane',
        lastName: 'Smith'
      },
      actionRequired: false
    },
    {
      _id: 3,
      title: 'New Message',
      message: 'You have a new message from Alex Johnson',
      type: 'message',
      isRead: false,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      color: 'green',
      icon: '💬',
      user: {
        profileImage: '/default-avatar.png',
        firstName: 'Alex',
        lastName: 'Johnson'
      },
      actionRequired: false
    }
  ];

  // Load notifications on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('userNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      // Initialize with sample data if no saved notifications
      setNotifications(sampleNotifications);
      localStorage.setItem('userNotifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleAcceptConnection = (notificationId) => {
    console.log('Accepting connection:', notificationId);
    handleMarkAsRead(notificationId);
    // Add your connection acceptance logic here
  };

  const handleIgnoreConnection = (notificationId) => {
    console.log('Ignoring connection:', notificationId);
    handleMarkAsRead(notificationId);
    // Add your connection ignore logic here
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'unread') return !notification.isRead;
    if (activeFilter === 'connection') return notification.type.includes('connection');
    if (activeFilter === 'mentions') return notification.type === 'mention';
    if (activeFilter === 'messages') return notification.type === 'message';
    if (activeFilter === 'events') return notification.type === 'event';
    return true;
  });

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      red: 'bg-red-100 text-red-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colorMap[color] || 'bg-blue-100 text-blue-600';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const notificationCounts = {
    all: notifications.length,
    unread: unreadCount,
    connection: notifications.filter(n => n.type.includes('connection')).length,
    mentions: notifications.filter(n => n.type === 'mention').length,
    messages: notifications.filter(n => n.type === 'message').length,
    events: notifications.filter(n => n.type === 'event').length
  };

  const filterButtons = [
    { key: 'all', label: 'All', count: notificationCounts.all },
    { key: 'unread', label: 'Unread', count: notificationCounts.unread },
    { key: 'connection', label: 'Connections', count: notificationCounts.connection },
    { key: 'mentions', label: 'Mentions', count: notificationCounts.mentions },
    { key: 'messages', label: 'Messages', count: notificationCounts.messages },
    { key: 'events', label: 'Events', count: notificationCounts.events }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <Link 
                  to="/"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  <span>←</span>
                  <span>Back to Home</span>
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaRegBell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                  <p className="text-gray-600 text-lg">
                    Stay updated with your professional activity
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm flex items-center space-x-2"
                >
                  <FaCheck className="w-4 h-4" />
                  <span>Mark all as read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center space-x-2"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>Clear all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-2">
            {filterButtons.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeFilter === filter.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50'
                }`}
              >
                <span>{filter.label}</span>
                {filter.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeFilter === filter.key 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {activeFilter === 'all' 
                  ? "You're all caught up! New notifications will appear here automatically."
                  : `No ${activeFilter} notifications found. Try changing your filter.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification._id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${getColorClass(notification.color)} flex items-center justify-center text-xl`}>
                    {notification.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {getTimeAgo(notification.timestamp)}
                        </span>
                        <div className="flex space-x-1">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 text-base leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <img
                          src={notification.user.profileImage || '/default-avatar.png'}
                          alt={`${notification.user.firstName} ${notification.user.lastName}`}
                          className="w-8 h-8 rounded-full border"
                        />
                        <span className="text-sm text-gray-600 font-medium">
                          {notification.user.firstName} {notification.user.lastName}
                        </span>
                      </div>
                      
                      {notification.actionRequired && (
                        <div className="flex space-x-2">
                          {notification.type === 'connection_request' && (
                            <>
                              <button
                                onClick={() => handleAcceptConnection(notification._id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold text-sm shadow-sm"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleIgnoreConnection(notification._id)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-sm"
                              >
                                Ignore
                              </button>
                            </>
                          )}
                          {notification.type === 'event' && (
                            <>
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold text-sm shadow-sm"
                              >
                                Attend
                              </button>
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-sm"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;