import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useUserData } from '../context/userContext'; // ✅ Use custom hook
import dp from "../assets/dp.webp";
import { Link } from 'react-router-dom';

function MyNetwork() {
  const { userData } = useUserData(); // ✅ Fixed - use custom hook
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Sample data for random generation
  const firstNames = [
    "Alex", "Maria", "James", "Sophia", "Ryan", "Emma", "Daniel", "Olivia",
    "Michael", "Sarah", "David", "Lisa", "Chris", "Jennifer", "Kevin", "Rachel",
    "Brian", "Amanda", "Jason", "Nicole", "Eric", "Michelle", "Steven", "Kimberly",
    "Justin", "Rebecca", "Matthew", "Laura", "Joshua", "Samantha"
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"
  ];

  const companies = [
    "Microsoft", "Google", "Apple", "Amazon", "Meta", "Netflix", "Tesla", "Adobe",
    "Salesforce", "IBM", "Oracle", "Intel", "Spotify", "Uber", "Airbnb", "Slack",
    "Twitter", "LinkedIn", "GitHub", "Stripe", "Shopify", "Zoom", "Dropbox", "Figma",
    "Notion", "Atlassian", "MongoDB", "Datadog", "Twilio", "Snowflake"
  ];

  const positions = [
    "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
    "DevOps Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Technical Lead", "Engineering Manager", "CTO", "CEO", "Marketing Director",
    "Sales Manager", "HR Specialist", "Business Analyst", "Project Manager",
    "QA Engineer", "System Administrator", "Network Engineer", "Security Analyst",
    "Mobile Developer", "Cloud Architect", "AI Engineer", "Machine Learning Specialist"
  ];

  const industries = [
    "Technology", "Finance", "Healthcare", "Education", "E-commerce", "Entertainment",
    "Manufacturing", "Real Estate", "Transportation", "Energy", "Media", "Consulting"
  ];

  const skills = [
    "JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "Kubernetes",
    "Machine Learning", "Data Analysis", "UI/UX Design", "Project Management",
    "Agile Methodologies", "Cloud Computing", "DevOps", "Cybersecurity", "Mobile Development"
  ];

  const generateRandomUser = (type = 'suggestion') => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const userSkills = [...skills]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 2);
    
    const mutualConnections = Math.floor(Math.random() * 50) + 1;
    const isOnline = Math.random() > 0.7;
    const isPremium = Math.random() > 0.8;

    return {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      firstName,
      lastName,
      userName: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      profileImage: dp,
      headline: `${position} at ${company}`,
      industry,
      skills: userSkills,
      mutualConnections,
      isOnline,
      isPremium,
      isConnected: type === 'connection',
      isFollowing: type === 'following',
      isFollower: type === 'follower',
      connectionDate: type === 'connection' ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    };
  };

  // Auto-generate network activity every 30 seconds
  useEffect(() => {
    const generateNetworkActivity = () => {
      // Randomly add new invitations (15% chance)
      if (Math.random() < 0.15) {
        const newInvitation = generateRandomUser('invitation');
        setInvitations(prev => [newInvitation, ...prev.slice(0, 49)]); // Limit to 50
      }

      // Randomly add new followers (10% chance)
      if (Math.random() < 0.10) {
        const newFollower = generateRandomUser('follower');
        setFollowers(prev => [newFollower, ...prev.slice(0, 49)]);
      }

      // Randomly update suggestions (20% chance)
      if (Math.random() < 0.20) {
        setSuggestions(prev => {
          const newSuggestion = generateRandomUser('suggestion');
          // Remove one random suggestion and add new one
          const filtered = prev.filter((_, index) => index !== Math.floor(Math.random() * prev.length));
          return [newSuggestion, ...filtered].slice(0, 8);
        });
      }

      // Random connection might accept your invitation (5% chance)
      if (Math.random() < 0.05 && invitations.length > 0) {
        const randomInvitation = invitations[Math.floor(Math.random() * invitations.length)];
        setInvitations(prev => prev.filter(inv => inv._id !== randomInvitation._id));
        setConnections(prev => [{ ...randomInvitation, isConnected: true, connectionDate: new Date() }, ...prev.slice(0, 99)]);
      }
    };

    // Generate initial data
    const initialConnections = Array.from({ length: 8 }, () => generateRandomUser('connection'));
    const initialInvitations = Array.from({ length: 5 }, () => generateRandomUser('invitation'));
    const initialFollowing = Array.from({ length: 12 }, () => generateRandomUser('following'));
    const initialFollowers = Array.from({ length: 15 }, () => generateRandomUser('follower'));
    const initialSuggestions = Array.from({ length: 8 }, () => generateRandomUser('suggestion'));

    setConnections(initialConnections);
    setInvitations(initialInvitations);
    setFollowing(initialFollowing);
    setFollowers(initialFollowers);
    setSuggestions(initialSuggestions);

    // Set up interval for auto-generation (30 seconds)
    const interval = setInterval(generateNetworkActivity, 30000);

    return () => clearInterval(interval);
  }, [invitations.length]);

  const handleAcceptInvitation = (userId) => {
    const invitation = invitations.find(inv => inv._id === userId);
    if (invitation) {
      setInvitations(prev => prev.filter(inv => inv._id !== userId));
      setConnections(prev => [{ ...invitation, isConnected: true, connectionDate: new Date() }, ...prev]);
    }
  };

  const handleIgnoreInvitation = (userId) => {
    setInvitations(prev => prev.filter(inv => inv._id !== userId));
  };

  const handleRemoveConnection = (userId) => {
    setConnections(prev => prev.filter(conn => conn._id !== userId));
  };

  const handleConnect = (userId) => {
    const user = suggestions.find(sug => sug._id === userId) || 
                 followers.find(fol => fol._id === userId);
    if (user) {
      setSuggestions(prev => prev.filter(sug => sug._id !== userId));
      setInvitations(prev => [{ ...user }, ...prev]);
    }
  };

  const handleFollow = (userId) => {
    const user = suggestions.find(sug => sug._id === userId) || 
                 connections.find(conn => conn._id === userId) ||
                 followers.find(fol => fol._id === userId);
    if (user && !following.find(fol => fol._id === userId)) {
      setFollowing(prev => [{ ...user, isFollowing: true }, ...prev]);
    }
  };

  const handleUnfollow = (userId) => {
    setFollowing(prev => prev.filter(fol => fol._id !== userId));
  };

  const handleRemoveFollower = (userId) => {
    setFollowers(prev => prev.filter(fol => fol._id !== userId));
  };

  const handleMessage = (userId) => {
    console.log('Message user:', userId);
    // Implement messaging functionality
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  const getConnectionDuration = (connectionDate) => {
    const now = new Date();
    const diff = now - connectionDate;
    const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
    return months > 0 ? `${months} month${months > 1 ? 's' : ''}` : 'Recently';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Link 
                  to="/"
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <span>←</span>
                  <span>Back to Home</span>
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Network</h1>
              <p className="text-gray-600">
                Manage your professional connections and grow your network
              </p>
              <div className="mt-2 text-sm text-green-600 font-medium">
                🔄 Auto-updating every 30 seconds
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{connections.length}</div>
              <div className="text-blue-600 text-sm">Connections</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{invitations.length}</div>
              <div className="text-orange-600 text-sm">Invitations</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{following.length}</div>
              <div className="text-purple-600 text-sm">Following</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{followers.length}</div>
              <div className="text-green-600 text-sm">Followers</div>
            </div>
          </div>
        </div>

        {/* Auto-generation Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <span className="text-green-700 font-medium">
                Live Network Updates Active
              </span>
              <p className="text-green-600 text-sm">
                Your network is automatically updated every 30 seconds with new invitations, followers, and suggestions
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { key: 'connections', label: 'Connections', count: connections.length },
              { key: 'invitations', label: 'Invitations', count: invitations.length },
              { key: 'following', label: 'Following', count: following.length },
              { key: 'followers', label: 'Followers', count: followers.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative min-w-32 ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`absolute top-2 right-4 text-xs px-2 py-1 rounded-full ${
                    tab.key === 'invitations' 
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Connections Tab */}
            {activeTab === 'connections' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Your Connections ({connections.length})
                  </h3>
                </div>
                {connections.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No connections yet
                    </h3>
                    <p className="text-gray-600">
                      Start connecting with colleagues and professionals in your industry
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {connections.map(user => (
                      <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="relative">
                            <img 
                              src={user.profileImage || dp} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                            {user.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                            {user.isPremium && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">⭐</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-800 text-sm">
                                {user.firstName} {user.lastName}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-xs">{user.headline}</p>
                            <p className="text-gray-500 text-xs">
                              {user.mutualConnections} mutual connections
                            </p>
                            <p className="text-gray-400 text-xs">
                              Connected {getConnectionDuration(user.connectionDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMessage(user._id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-xs font-medium"
                          >
                            Message
                          </button>
                          <button
                            onClick={() => handleRemoveConnection(user._id)}
                            className="px-3 py-1 border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition-colors text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Invitations Tab */}
            {activeTab === 'invitations' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Pending Invitations ({invitations.length})
                  </h3>
                </div>
                {invitations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📨</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No pending invitations
                    </h3>
                    <p className="text-gray-600">
                      You're all caught up! New connection requests will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {invitations.map(user => (
                      <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="relative">
                            <img 
                              src={user.profileImage || dp} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                            {user.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-sm">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-gray-600 text-xs">{user.headline}</p>
                            <p className="text-gray-500 text-xs">
                              {user.mutualConnections} mutual connections
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.skills.slice(0, 2).map(skill => (
                                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptInvitation(user._id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleIgnoreInvitation(user._id)}
                            className="px-4 py-2 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-xs font-medium"
                          >
                            Ignore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Following Tab */}
            {activeTab === 'following' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4">
                  People You're Following ({following.length})
                </h3>
                {following.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">👤</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Not following anyone
                    </h3>
                    <p className="text-gray-600">
                      Start following people to see their updates in your feed
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {following.map(user => (
                      <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="relative">
                            <img 
                              src={user.profileImage || dp} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                            {user.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-sm">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-gray-600 text-xs">{user.headline}</p>
                            <p className="text-gray-500 text-xs">Last active {getTimeAgo(user.lastActive)}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnfollow(user._id)}
                          className="px-4 py-2 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-xs font-medium"
                        >
                          Unfollow
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Followers Tab */}
            {activeTab === 'followers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Your Followers ({followers.length})
                  </h3>
                </div>
                {followers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No followers yet
                    </h3>
                    <p className="text-gray-600">
                      Build your network to get more followers
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {followers.map(user => (
                      <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="relative">
                            <img 
                              src={user.profileImage || dp} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                            {user.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-sm">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-gray-600 text-xs">{user.headline}</p>
                            <p className="text-gray-500 text-xs">Followed you {getTimeAgo(user.lastActive)}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFollow(user._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs font-medium"
                          >
                            Follow Back
                          </button>
                          <button
                            onClick={() => handleRemoveFollower(user._id)}
                            className="px-3 py-1 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">People you may know</h2>
            <div className="text-xs text-gray-500">
              Auto-updates every 30 seconds
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestions.map(user => (
              <div key={user._id} className="flex flex-col p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <img 
                      src={user.profileImage || dp} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-500 text-xs">{user.headline}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-500 text-xs mb-2">
                    {user.mutualConnections} mutual connections
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {user.skills.slice(0, 2).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-auto">
                  <button 
                    onClick={() => handleConnect(user._id)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-xs font-medium"
                  >
                    Connect
                  </button>
                  <button 
                    onClick={() => handleFollow(user._id)}
                    className="flex-1 px-3 py-2 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-xs font-medium"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyNetwork;