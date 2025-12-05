// src/pages/Messages.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserContext';
import { demoUsers } from '../context/AuthContext';
import { FaSearch, FaPaperPlane, FaReply, FaEllipsisV, FaTimes, FaPaperclip, FaSmile, FaCheck, FaCheckDouble } from 'react-icons/fa';
import { IoIosSend } from "react-icons/io";

function Messages() {
  const { authData } = useAuth();
  const { userData } = useUserData();
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize conversations based on logged-in user
  const [conversations, setConversations] = useState([]);

  // Initialize conversations when authData changes
  useEffect(() => {
    if (authData.user?.id) {
      // Try to load conversations from localStorage first
      const savedConversations = localStorage.getItem(`conversations_${authData.user.id}`);
      if (savedConversations) {
        try {
          const parsedConversations = JSON.parse(savedConversations);
          setConversations(parsedConversations);
          return;
        } catch (error) {
          console.error('Failed to parse saved conversations:', error);
        }
      }
      
      // If no saved conversations, create new ones
      // Get all demo users except the current user
      const otherUsers = demoUsers.filter(user => user.id !== authData.user.id);
      
      // Create conversations with each other user
      const userConversations = otherUsers.map((otherUser, index) => {
        // Generate conversation ID based on user IDs (sorted alphabetically)
        const userIds = [authData.user.id, otherUser.id].sort();
        const convId = `conv_${userIds[0]}_${userIds[1]}`;
        
        // Create sample messages for demo purposes
        const sampleMessages = [
          {
            id: `msg_sample_${index}_1`,
            senderId: otherUser.id,
            text: `Hi ${authData.user.firstName}, I saw your recent post. Great insights!`,
            timestamp: new Date(Date.now() - 86400000 * (index + 1)), // 1-4 days ago
            read: true,
            type: 'text'
          },
          {
            id: `msg_sample_${index}_2`,
            senderId: authData.user.id,
            text: `Thanks ${otherUser.firstName}! I'm glad you found it helpful.`,
            timestamp: new Date(Date.now() - 86400000 * index), // 0-3 days ago
            read: true,
            type: 'text'
          }
        ];
        
        // Add an unread message for the last conversation
        if (index === otherUsers.length - 1) {
          sampleMessages.push({
            id: `msg_sample_${index}_3`,
            senderId: otherUser.id,
            text: `Would you like to collaborate on a project together?`,
            timestamp: new Date(),
            read: false,
            type: 'text'
          });
        }
        
        return {
          id: convId,
          peer: {
            id: otherUser.id,
            name: `${otherUser.firstName} ${otherUser.lastName}`,
            title: otherUser.headline,
            avatar: otherUser.profileImage || '',
            online: Math.random() > 0.5 // Random online status for demo
          },
          messages: sampleMessages,
          unread: index === otherUsers.length - 1 ? 1 : 0 // Last conversation has 1 unread message
        };
      });
      
      setConversations(userConversations);
    }
  }, [authData.user]);

  // Set active chat when a user ID is provided in query params
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.peer.id === userId);
      if (conversation) {
        setActiveChat(conversation.id);
        // Scroll to the conversation
        setTimeout(() => {
          const element = document.getElementById(`conversation-${conversation.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [searchParams, conversations]);

  // Fallback: if user ID is provided but conversations weren't ready, try again when they load
  useEffect(() => {
    if (conversations.length > 0) {
      const userId = searchParams.get('userId');
      if (userId) {
        const conversation = conversations.find(conv => conv.peer.id === userId);
        if (conversation && !activeChat) {
          setActiveChat(conversation.id);
          // Scroll to the conversation
          setTimeout(() => {
            const element = document.getElementById(`conversation-${conversation.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }
    }
  }, [conversations, activeChat, searchParams]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (authData.user?.id && conversations.length > 0) {
      try {
        localStorage.setItem(`conversations_${authData.user.id}`, JSON.stringify(conversations));
      } catch (error) {
        console.error('Failed to save conversations to localStorage:', error);
      }
    }
  }, [conversations, authData.user?.id]);

  // Filtered conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.peer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get active conversation
  const activeConversation = activeChat ?
    conversations.find(conv => conv.id === activeChat) : null;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  // Send a new message
  const sendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: authData.user?.id || 'current_user',
      text: messageInput,
      timestamp: new Date(),
      read: false,
      type: 'text',
      replyTo: replyTo
    };

    // Update conversations with new message
    setConversations(prev => prev.map(conv =>
      conv.id === activeChat
        ? {
          ...conv,
          messages: [...conv.messages, newMessage],
          unread: 0
        }
        : conv
    ));

    // Create notification for the recipient
    const activeConv = conversations.find(conv => conv.id === activeChat);
    if (activeConv) {
      // In a real app, we would send this to the recipient
      // For demo, we'll just log it
      console.log('Message sent to:', activeConv.peer.name);
      
      // Show success message
      alert(`Message sent to ${activeConv.peer.name}!`);
    }

    setMessageInput('');
    setReplyTo(null);

    // In a real app, we would send this message to a backend service
    // For demo purposes, we'll just show a confirmation
    console.log('Message sent:', newMessage);
  };

  // Simulate a reply from the peer
  const simulateReply = (conversationId) => {
    // For demo purposes, we'll disable simulated replies to avoid confusion
    // In a real app, messages would come from other users through a backend service
    console.log('Simulated reply skipped for demo clarity');
  };

  // Start a reply to a message
  const startReply = (message) => {
    setReplyTo(message);
    setMessageInput(`Replying to "${message.text.substring(0, 30)}${message.text.length > 30 ? '...' : ''}" `);
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyTo(null);
    setMessageInput('');
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate file message
    const fileMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'current_user',
      text: `File: ${file.name}`,
      timestamp: new Date(),
      read: false,
      type: 'file',
      file: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    };

    setConversations(prev => prev.map(conv =>
      conv.id === activeChat
        ? {
          ...conv,
          messages: [...conv.messages, fileMessage],
          unread: 0
        }
        : conv
    ));

    // Reset file input
    e.target.value = '';
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if messages are from the same sender and same day
  const shouldGroupMessages = (currentMsg, previousMsg) => {
    if (!previousMsg) return false;

    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const previousDate = new Date(previousMsg.timestamp).toDateString();

    return currentMsg.senderId === previousMsg.senderId && currentDate === previousDate;
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2f0] pt-20">
      <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex">

        {/* Conversations List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">

          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <button className="text-gray-500 hover:text-gray-700">
                <FaEllipsisV className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                id={`conversation-${conversation.id}`}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${activeChat === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                onClick={() => setActiveChat(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar with online status */}
                  <div className="relative">
                    <img
                      src={conversation.peer.avatar}
                      alt={conversation.peer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.peer.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Conversation info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.peer.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.messages[conversation.messages.length - 1]?.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {conversation.peer.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      ID: {conversation.peer.id}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.messages[conversation.messages.length - 1]?.text}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conversation.unread > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={activeConversation.peer.avatar}
                      alt={activeConversation.peer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {activeConversation.peer.online && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {activeConversation.peer.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {activeConversation.peer.online ? 'Online' : 'Last seen recently'}
                    </p>
                    <p className="text-xs text-gray-400">
                      ID: {activeConversation.peer.id}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <FaEllipsisV className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {activeConversation.messages.map((message, index) => {
                  const isCurrentUser = message.senderId === 'current_user';
                  const previousMessage = activeConversation.messages[index - 1];
                  const showHeader = !shouldGroupMessages(message, previousMessage);

                  return (
                    <div key={message.id}>
                      {/* Date separator */}
                      {index === 0 || formatDate(message.timestamp) !== formatDate(previousMessage.timestamp) ? (
                        <div className="text-center my-4">
                          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      ) : null}

                      {/* Message */}
                      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>

                          {/* Message header (avatar and name) */}
                          {showHeader && !isCurrentUser && (
                            <div className="flex items-center space-x-2 mb-1">
                              <img
                                src={activeConversation.peer.avatar}
                                alt={activeConversation.peer.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-xs font-medium text-gray-700">
                                {activeConversation.peer.name}
                              </span>
                            </div>
                          )}

                          {/* Reply context */}
                          {message.replyTo && (
                            <div className="bg-gray-100 border-l-4 border-blue-500 p-2 mb-1 rounded text-xs text-gray-600">
                              <div className="font-medium">
                                Replying to {message.replyTo.senderId === 'current_user' ? 'yourself' : activeConversation.peer.name}
                              </div>
                              <div className="truncate">{message.replyTo.text}</div>
                            </div>
                          )}

                          {/* Message bubble */}
                          <div
                            className={`relative p-3 rounded-2xl ${isCurrentUser
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                              }`}
                          >
                            {/* Reply button */}
                            {!isCurrentUser && (
                              <button
                                onClick={() => startReply(message)}
                                className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaReply className="w-3 h-3 text-gray-600" />
                              </button>
                            )}

                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>

                            {/* Message footer */}
                            <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                              }`}>
                              <span>{formatTime(message.timestamp)}</span>
                              {isCurrentUser && (
                                message.read ? (
                                  <FaCheckDouble className="w-3 h-3" />
                                ) : (
                                  <FaCheck className="w-3 h-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Preview */}
              {replyTo && (
                <div className="px-4 pt-2 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-medium">Replying to</div>
                      <div className="text-sm text-gray-700 truncate">{replyTo.text}</div>
                    </div>
                    <button
                      onClick={cancelReply}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  {/* Attachment button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    <FaPaperclip className="w-5 h-5" />
                  </button>

                  {/* File input (hidden) */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="*/*"
                  />

                  {/* Message input */}
                  <div className="flex-1 bg-gray-100 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full bg-transparent border-none resize-none focus:outline-none p-3 text-sm max-h-32"
                      rows="1"
                    />
                  </div>

                  {/* Emoji and Send buttons */}
                  <div className="flex items-center space-x-1">
                    <button className="text-gray-500 hover:text-gray-700 p-2">
                      <FaSmile className="w-5 h-5" />
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!messageInput.trim()}
                      className={`p-2 rounded-full ${messageInput.trim()
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        } transition-colors`}
                    >
                      <IoIosSend className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No chat selected state */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your Messages
                </h3>
                <p className="text-gray-600 mb-6">
                  Select a conversation to start messaging
                </p>
                <Link
                  to="/"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;