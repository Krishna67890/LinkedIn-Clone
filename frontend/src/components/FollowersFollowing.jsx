import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GiSplitCross } from "react-icons/gi";
import { UserContext } from '../context/userContext';
import dp from "../assets/dp.webp";
import { useAuth } from '/src/context/authContext.jsx';

function FollowersFollowing() {
  const { edit, setEdit, userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authContext);

  const [activeTab, setActiveTab] = useState('followers'); // 'followers' or 'following'
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in real app, you'd fetch from API
  const sampleFollowers = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      userName: "johndoe",
      profileImage: dp,
      headline: "Software Engineer at Google",
      isFollowing: true
    },
    {
      _id: "2",
      firstName: "Sarah",
      lastName: "Wilson",
      userName: "sarahw",
      profileImage: dp,
      headline: "Product Manager at Microsoft",
      isFollowing: false
    },
    {
      _id: "3",
      firstName: "Mike",
      lastName: "Johnson",
      userName: "mikej",
      profileImage: dp,
      headline: "Data Scientist at Amazon",
      isFollowing: true
    },
    {
      _id: "4",
      firstName: "Emily",
      lastName: "Chen",
      userName: "emilyc",
      profileImage: dp,
      headline: "UX Designer at Apple",
      isFollowing: false
    },
    {
      _id: "5",
      firstName: "Alex",
      lastName: "Rodriguez",
      userName: "alexr",
      profileImage: dp,
      headline: "Full Stack Developer",
      isFollowing: true
    }
  ];

  const sampleFollowing = [
    {
      _id: "6",
      firstName: "David",
      lastName: "Brown",
      userName: "davidb",
      profileImage: dp,
      headline: "CTO at Startup Inc",
      isFollowing: true
    },
    {
      _id: "7",
      firstName: "Lisa",
      lastName: "Taylor",
      userName: "lisat",
      profileImage: dp,
      headline: "Marketing Director",
      isFollowing: true
    },
    {
      _id: "8",
      firstName: "Kevin",
      lastName: "Martinez",
      userName: "kevinm",
      profileImage: dp,
      headline: "Senior DevOps Engineer",
      isFollowing: true
    },
    {
      _id: "9",
      firstName: "Rachel",
      lastName: "Green",
      userName: "rachelg",
      profileImage: dp,
      headline: "HR Manager",
      isFollowing: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setFollowers(sampleFollowers);
      setFollowing(sampleFollowing);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFollow = (userId) => {
    setFollowers(prev => 
      prev.map(user => 
        user._id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  const handleUnfollow = (userId) => {
    setFollowing(prev => prev.filter(user => user._id !== userId));
    // Also update followers list if this user follows back
    setFollowers(prev => 
      prev.map(user => 
        user._id === userId 
          ? { ...user, isFollowing: false }
          : user
      )
    );
  };

  const handleRemoveFollower = (userId) => {
    setFollowers(prev => prev.filter(user => user._id !== userId));
  };

  const filteredFollowers = followers.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.headline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFollowing = following.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.headline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!edit) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'>
        
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>
              {userData?.firstName} {userData?.lastName}
            </h2>
            <p className='text-gray-600 text-sm mt-1'>Manage your connections</p>
          </div>
          <button 
            onClick={() => setEdit(false)}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <GiSplitCross className='w-6 h-6 text-gray-600' />
          </button>
        </div>

        {/* Tabs */}
        <div className='border-b border-gray-200'>
          <div className='flex'>
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'followers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Followers
              <span className='ml-2 text-sm font-normal text-gray-500'>
                ({followers.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'following'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Following
              <span className='ml-2 text-sm font-normal text-gray-500'>
                ({following.length})
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className='p-4 border-b border-gray-200'>
          <div className='relative'>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
            <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
              🔍
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto'>
          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
            </div>
          ) : (
            <div className='p-4'>
              {/* Followers Tab */}
              {activeTab === 'followers' && (
                <div className='space-y-4'>
                  {filteredFollowers.length === 0 ? (
                    <div className='text-center py-12'>
                      <div className='text-gray-400 text-6xl mb-4'>👥</div>
                      <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                        {searchTerm ? 'No matching followers' : 'No followers yet'}
                      </h3>
                      <p className='text-gray-600'>
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : 'Start connecting with people to grow your network'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredFollowers.map(user => (
                      <div key={user._id} className='flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors'>
                        <div className='flex items-center space-x-4'>
                          <div className='w-12 h-12 rounded-full overflow-hidden'>
                            <img 
                              src={user.profileImage || dp} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <div>
                            <h3 className='font-semibold text-gray-800'>
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className='text-gray-600 text-sm'>{user.headline}</p>
                            <p className='text-gray-500 text-xs'>@{user.userName}</p>
                          </div>
                        </div>
                        <div className='flex space-x-2'>
                          {user.isFollowing ? (
                            <button
                              onClick={() => handleUnfollow(user._id)}
                              className='px-4 py-2 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium'
                            >
                              Following
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFollow(user._id)}
                              className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm font-medium'
                            >
                              Follow
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveFollower(user._id)}
                            className='px-4 py-2 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium'
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Following Tab */}
              {activeTab === 'following' && (
                <div className='space-y-4'>
                  {filteredFollowing.length === 0 ? (
                    <div className='text-center py-12'>
                      <div className='text-gray-400 text-6xl mb-4'>👤</div>
                      <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                        {searchTerm ? 'No matching connections' : 'Not following anyone yet'}
                      </h3>
                      <p className='text-gray-600'>
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : 'Start following people to see their updates'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredFollowing.map(user => (
                      <div key={user._id} className='flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors'>
                        <div className='flex items-center space-x-4'>
                          <div className='w-12 h-12 rounded-full overflow-hidden'>
                            <img 
                              src={user.profileImage || dp} 
                              alt={`${user.firstName} ${user.lastName}`}
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <div>
                            <h3 className='font-semibold text-gray-800'>
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className='text-gray-600 text-sm'>{user.headline}</p>
                            <p className='text-gray-500 text-xs'>@{user.userName}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnfollow(user._id)}
                          className='px-4 py-2 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium'
                        >
                          Following
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className='border-t border-gray-200 p-4 bg-gray-50'>
          <div className='flex justify-between text-sm text-gray-600'>
            <div className='text-center'>
              <div className='font-semibold text-gray-800'>{followers.length}</div>
              <div>Followers</div>
            </div>
            <div className='text-center'>
              <div className='font-semibold text-gray-800'>{following.length}</div>
              <div>Following</div>
            </div>
            <div className='text-center'>
              <div className='font-semibold text-gray-800'>
                {followers.filter(f => f.isFollowing).length}
              </div>
              <div>Mutual</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowersFollowing; 