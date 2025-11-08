// src/pages/Messages.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { userDataContext } from '../context/userContext';
import { FaSearch, FaPaperPlane, FaReply, FaEllipsisV, FaTimes, FaPaperclip, FaSmile, FaCheck, FaCheckDouble } from 'react-icons/fa';
import { IoIosSend } from "react-icons/io";

function Messages() {
  const { authData } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock conversations data with peer IDs
  const [conversations, setConversations] = useState([
    {
      id: 'conv_1',
      peer: {
        id: 'peer_001',
        name: 'Sarah Wilson',
        title: 'Product Manager at Microsoft',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        online: true
      },
      messages: [
        {
          id: 'msg_1_1',
          senderId: 'peer_001',
          text: 'Hey! How are you doing?',
          timestamp: new Date(Date.now() - 3600000),
          read: true,
          type: 'text'
        },
        {
          id: 'msg_1_2',
          senderId: 'current_user',
          text: "I'm doing great! Just finished the project we discussed.",
          timestamp: new Date(Date.now() - 1800000),
          read: true,
          type: 'text'
        },
        {
          id: 'msg_1_3',
          senderId: 'peer_001',
          text: 'That\'s awesome! Can you share the details?',
          timestamp: new Date(Date.now() - 1200000),
          read: true,
          type: 'text'
        }
      ],
      unread: 0
    },
    {
      id: 'conv_2',
      peer: {
        id: 'peer_002',
        name: 'Mike Chen',
        title: 'Senior Data Scientist',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        online: false
      },
      messages: [
        {
          id: 'msg_2_1',
          senderId: 'current_user',
          text: 'Hi Mike, about our meeting tomorrow...',
          timestamp: new Date(Date.now() - 86400000),
          read: true,
          type: 'text'
        },
        {
          id: 'msg_2_2',
          senderId: 'peer_002',
          text: 'Looking forward to it! 2 PM works perfectly.',
          timestamp: new Date(Date.now() - 43200000),
          read: true,
          type: 'text'
        }
      ],
      unread: 0
    },
    {
      id: 'conv_3',
      peer: {
        id: 'peer_003',
        name: 'Alex Johnson',
        title: 'Frontend Developer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
        online: true
      },
      messages: [
        {
          id: 'msg_3_1',
          senderId: 'peer_003',
          text: 'Thanks for connecting! Loved your recent post about React patterns.',
          timestamp: new Date(Date.now() - 7200000),
          read: false,
          type: 'text'
        }
      ],
      unread: 1
    }
  ]);

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
      senderId: 'current_user',
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

    setMessageInput('');
    setReplyTo(null);

    // Simulate reply after 1-3 seconds
    setTimeout(() => {
      simulateReply(activeChat);
    }, 1000 + Math.random() * 2000);
  };

  // Simulate a reply from the peer
  const simulateReply = (conversationId) => {
    const replies = [
      "That's interesting! Tell me more.",
      "I completely agree with you.",
      "Thanks for sharing that information.",
      "Let's discuss this further in our next meeting.",
      "I have some thoughts on that topic.",
      "Could you elaborate on that point?",
      "That reminds me of something similar I experienced."
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const replyMessage = {
      id: `msg_${Date.now()}_reply`,
      senderId: conversations.find(conv => conv.id === conversationId)?.peer.id,
      text: randomReply,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, replyMessage],
            unread: conv.id === activeChat ? 0 : conv.unread + 1
          }
        : conv
    ));
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
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeChat === conversation.id ? 'bg-blue-50 border-blue-200' : ''
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
                            className={`relative p-3 rounded-2xl ${
                              isCurrentUser
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
                            <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                              isCurrentUser ? 'text-blue-200' : 'text-gray-500'
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
                      className={`p-2 rounded-full ${
                        messageInput.trim()
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