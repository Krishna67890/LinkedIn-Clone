import React, { useState, useEffect, useCallback } from 'react';
import { BsBell } from 'react-icons/bs';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import dp from "../assets/dp.webp";
import { Link } from 'react-router-dom';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample data for random generation
  const notificationTemplates = [
    {
      type: "connection_request",
      title: "Connection Request",
      messageTemplates: [
        "{name} wants to connect with you",
        "{name} sent you a connection request",
        "Connect with {name} to expand your network"
      ],
      actionRequired: true,
      icon: "👥",
      color: "blue"
    },
    {
      type: "post_like",
      title: "Post Liked",
      messageTemplates: [
        "{name} liked your post",
        "{name} appreciated your recent post",
        "Your post got a like from {name}"
      ],
      actionRequired: false,
      icon: "❤️",
      color: "red"
    },
    {
      type: "comment",
      title: "New Comment",
      messageTemplates: [
        "{name} commented on your post",
        "{name} replied to your post",
        "New comment from {name} on your article"
      ],
      actionRequired: false,
      icon: "💬",
      color: "green"
    }
  ];

  const userNames = [
    { firstName: "Alex", lastName: "Thompson", profileImage: dp },
    { firstName: "Maria", lastName: "Garcia", profileImage: dp },
    { firstName: "James", lastName: "Wilson", profileImage: dp },
    { firstName: "Sophia", lastName: "Chen", profileImage: dp },
    { firstName: "Ryan", lastName: "Miller", profileImage: dp }
  ];

  // Generate random notification
  const generateRandomNotification = useCallback(() => {
    const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
    const user = userNames[Math.floor(Math.random() * userNames.length)];
    
    let message = template.messageTemplates[Math.floor(Math.random() * template.messageTemplates.length)];
    message = message.replace('{name}', `${user.firstName} ${user.lastName}`);

    return {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: template.type,
      title: template.title,
      message: message,
      user: user,
      timestamp: new Date(),
      isRead: false,
      actionRequired: template.actionRequired,
      icon: template.icon,
      color: template.color
    };
  }, []);

  // Auto-generate notifications every 30 seconds
  useEffect(() => {
    const generateNotification = () => {
      const newNotification = generateRandomNotification();
      setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
    };

    // Generate initial notifications
    const initialNotifications = Array.from({ length: 3 }, () => generateRandomNotification());
    setNotifications(initialNotifications);

    // Set up interval for every 30 seconds
    const interval = setInterval(generateNotification, 30000);

    return () => clearInterval(interval);
  }, [generateRandomNotification]);

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
  };

  const handleIgnoreConnection = (notificationId) => {
    console.log('Ignoring connection:', notificationId);
    handleMarkAsRead(notificationId);
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
    return true;
  });

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <BsBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-2 mt-3 overflow-x-auto">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'connection', label: 'Connections' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    activeFilter === filter.key
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-64">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <BsBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map(notification => (
                  <div 
                    key={notification._id} 
                    className={`p-3 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex space-x-3">
                      {/* Notification Icon */}
                      <div 
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          notification.color === 'blue' ? 'bg-blue-100' :
                          notification.color === 'red' ? 'bg-red-100' :
                          'bg-green-100'
                        }`}
                      >
                        {notification.icon}
                      </div>
                      
                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <img 
                                src={notification.user.profileImage || dp} 
                                alt={notification.user.firstName}
                                className="w-3 h-3 rounded-full"
                              />
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex space-x-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                                title="Mark as read"
                              >
                                <FiCheck className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {notification.actionRequired && (
                          <div className="flex space-x-2 mt-2">
                            {notification.type === 'connection_request' && (
                              <>
                                <button
                                  onClick={() => handleAcceptConnection(notification._id)}
                                  className="px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleIgnoreConnection(notification._id)}
                                  className="px-2 py-1 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-xs"
                                >
                                  Ignore
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Link 
                to="/notifications"
                className="block text-center text-sm text-blue-500 hover:text-blue-600 font-medium"
                onClick={() => setShowNotifications(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;