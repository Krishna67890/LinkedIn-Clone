import React, { useState, useRef, useEffect } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { CiCirclePlus, CiCamera } from "react-icons/ci";
// import { useUserData } from '../context/userContext'; // ✅ Use custom hook
import { FaPencilAlt, FaEllipsisH, FaRegComment, FaRegShareSquare, FaRegBookmark, FaRegSmile } from "react-icons/fa";
import { MdPhotoLibrary, MdVideoLibrary, MdEvent, MdArticle, MdWork, MdSchool, MdPublic } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import EditProfile from '../components/EditProfile';
import { GiSplitCross } from "react-icons/gi";
import { FaImages, FaSmile, FaCalendarAlt, FaBell, FaUsers, FaRegHeart, FaHeart, FaRegThumbsUp, FaThumbsUp, FaLinkedin } from "react-icons/fa";
import { useAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

function Home() {
let { userData, setUserData, edit, setEdit } = useUserData()
  
  const { authData, demoLogout } = useAuth()
  
  let [frontendImage, setFrontendImage] = useState("")
  let [backendImage, setBackendImage] = useState("")
  let [description, setDescription] = useState("")
  let [uploadPost, setUploadPost] = useState(false)
  let [activeTab, setActiveTab] = useState('all')
  let [loading, setLoading] = useState(false)
  let [showEmojiPicker, setShowEmojiPicker] = useState(false)
  let [audience, setAudience] = useState('public')
  let image = useRef()
  const navigate = useNavigate()

  // Enhanced posts state with more realistic data
  const [posts, setPosts] = useState([]);
  const [suggestedConnections, setSuggestedConnections] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Check authentication - use authData from useAuth hook
  useEffect(() => {
    if (!authData.isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [authData.isAuthenticated, navigate]);

  // Load user posts and initial data
  useEffect(() => {
    if (authData.isAuthenticated) {
      loadUserPosts();
      loadInitialData();
      loadSuggestedConnections();
      loadTrendingNews();
    }
  }, [authData.isAuthenticated]);

  const loadUserPosts = async () => {
    try {
      setIsLoadingPosts(true);
      
      // Use demo data instead of API call
      const demoUserPosts = [
        {
          id: 1,
          user: {
            name: `${userData?.firstName} ${userData?.lastName}`,
            title: userData?.headline || "Professional",
            avatar: userData?.profileImage || dp,
            company: userData?.company || "",
            connectionLevel: "1st"
          },
          content: "Excited to start my professional journey on this platform! Looking forward to connecting with amazing people. #newbeginnings",
          time: "Just now",
          timestamp: new Date(),
          likes: 2,
          comments: 1,
          shares: 0,
          liked: false,
          saved: false,
          type: "update",
          image: null,
          hashtags: ["newbeginnings", "career"]
        },
        {
          id: 2,
          user: {
            name: `${userData?.firstName} ${userData?.lastName}`,
            title: userData?.headline || "Professional",
            avatar: userData?.profileImage || dp,
            company: userData?.company || "",
            connectionLevel: "1st"
          },
          content: "Just completed an amazing project! Learned so much about modern web development and team collaboration. #webdev #learning",
          time: "1h ago",
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          likes: 5,
          comments: 3,
          shares: 1,
          liked: true,
          saved: false,
          type: "achievement",
          image: null,
          hashtags: ["webdev", "learning", "project"]
        }
      ];
      
      setUserPosts(demoUserPosts);
    } catch (error) {
      console.error("Error loading user posts:", error);
      // Fallback to empty array
      setUserPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadInitialData = () => {
    // Sample posts data
    const samplePosts = [
      {
        id: 1,
        user: {
          name: "John Doe",
          title: "Software Engineer at Google",
          avatar: dp,
          company: "Google",
          connectionLevel: "2nd"
        },
        content: "Just launched an amazing new feature! So proud of my team for making this happen. #innovation #tech",
        time: "2h ago",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 45,
        comments: 12,
        shares: 5,
        liked: false,
        saved: false,
        type: "update",
        image: null,
        hashtags: ["innovation", "tech", "launch"]
      },
      {
        id: 2,
        user: {
          name: "Sarah Wilson",
          title: "Product Manager at Microsoft",
          avatar: dp,
          company: "Microsoft",
          connectionLevel: "1st"
        },
        content: "Excited to announce our new product line! Can't wait to see how it helps our customers achieve their goals. Looking forward to the impact this will make in the industry.",
        time: "4h ago",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 89,
        comments: 23,
        shares: 8,
        liked: true,
        saved: true,
        type: "announcement",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        hashtags: ["productlaunch", "innovation", "customersuccess"]
      },
      {
        id: 3,
        user: {
          name: "Mike Chen",
          title: "Senior Data Scientist at Amazon",
          avatar: dp,
          company: "Amazon",
          connectionLevel: "3rd"
        },
        content: "Just published a new research paper on machine learning applications in healthcare. Grateful for my collaborators and the opportunity to contribute to this important field.",
        time: "1d ago",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        likes: 156,
        comments: 34,
        shares: 12,
        liked: false,
        saved: false,
        type: "achievement",
        image: null,
        hashtags: ["machinelearning", "healthcare", "research"]
      }
    ];
    setPosts(samplePosts);
  };

  const loadSuggestedConnections = () => {
    const connections = [
      {
        id: 1,
        name: "Alex Johnson",
        title: "Frontend Developer at Netflix",
        avatar: dp,
        mutualConnections: 15,
        company: "Netflix"
      },
      {
        id: 2,
        name: "Maria Garcia",
        title: "UX Designer at Spotify",
        avatar: dp,
        mutualConnections: 8,
        company: "Spotify"
      },
      {
        id: 3,
        name: "David Kim",
        title: "Backend Engineer at Airbnb",
        avatar: dp,
        mutualConnections: 12,
        company: "Airbnb"
      }
    ];
    setSuggestedConnections(connections);
  };

  const loadTrendingNews = () => {
    const news = [
      {
        id: 1,
        title: "Remote work trends in 2024",
        description: "How companies are adapting to hybrid models",
        time: "1h ago",
        readers: "12,345"
      },
      {
        id: 2,
        title: "AI transforming industries",
        description: "Latest developments in artificial intelligence",
        time: "3h ago",
        readers: "8,432"
      },
      {
        id: 3,
        title: "Sustainable business practices",
        description: "Companies leading in environmental initiatives",
        time: "5h ago",
        readers: "6,789"
      }
    ];
    setTrendingNews(news);
  };

  function handleImage(e) {
    let file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  const handleEmojiClick = (emojiData) => {
    setDescription(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  async function handleUploadPost() {
    if (!description.trim() && !backendImage) {
      alert('Please add some content or image to your post');
      return;
    }

    setLoading(true);
    try {
      // Create post locally without API call
      const newPost = {
        id: Date.now(), // Use timestamp as ID
        user: {
          name: `${userData?.firstName} ${userData?.lastName}`,
          title: userData?.headline || "Professional",
          avatar: userData?.profileImage || dp,
          company: userData?.company || "",
          connectionLevel: "1st"
        },
        content: description,
        time: "Just now",
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        saved: false,
        type: "update",
        image: frontendImage || null,
        audience: audience,
        hashtags: description.match(/#\w+/g) || []
      };
      
      // Add to user posts
      setUserPosts(prev => [newPost, ...prev]);
      
      // Reset form
      setUploadPost(false);
      setDescription("");
      setFrontendImage("");
      setBackendImage(null);
      setAudience('public');
      setShowEmojiPicker(false);
      
      // Show success message
      alert('Post created successfully! (Demo Mode)');
      
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleLike = (postId, isUserPost = false) => {
    // Update UI immediately without API call
    if (isUserPost) {
      setUserPosts(posts => posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked
            }
          : post
      ));
    } else {
      setPosts(posts => posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked
            }
          : post
      ));
    }
  };

  const handleSave = (postId, isUserPost = false) => {
    // Update UI immediately without API call
    if (isUserPost) {
      setUserPosts(posts => posts.map(post => 
        post.id === postId 
          ? { ...post, saved: !post.saved }
          : post
      ));
    } else {
      setPosts(posts => posts.map(post => 
        post.id === postId 
          ? { ...post, saved: !post.saved }
          : post
      ));
    }
  };

  const handleConnect = (connectionId) => {
    setSuggestedConnections(suggestedConnections.filter(conn => conn.id !== connectionId));
    alert('Connection request sent!');
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getAllPosts = () => {
    return [...userPosts, ...posts];
  };

  const filteredPosts = getAllPosts().filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'images') return post.image;
    if (activeTab === 'popular') return post.likes > 50;
    if (activeTab === 'following') return !userPosts.some(userPost => userPost.id === post.id);
    return true;
  });

  const getAudienceIcon = (audienceType) => {
    switch (audienceType) {
      case 'public':
        return <MdPublic className="w-4 h-4" />;
      case 'connections':
        return <FaUsers className="w-4 h-4" />;
      case 'private':
        return <FaRegSmile className="w-4 h-4" />;
      default:
        return <MdPublic className="w-4 h-4" />;
    }
  };

  const getAudienceText = (audienceType) => {
    switch (audienceType) {
      case 'public':
        return 'Anyone';
      case 'connections':
        return 'Connections only';
      case 'private':
        return 'No one';
      default:
        return 'Anyone';
    }
  };

  // Don't render if not authenticated
  if (!authData.isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-[#f3f2f0]'>
      {edit && <EditProfile />}
      
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <FaLinkedin className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">LinkedIn</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex flex-col items-center space-y-1 text-blue-500 border-b-2 border-blue-500 pb-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7z"/>
                </svg>
                <span className="text-xs">Home</span>
              </Link>

              <Link 
                to="/network" 
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900"
              >
                <FaUsers className="w-6 h-6" />
                <span className="text-xs">Network</span>
              </Link>

              <Link 
                to="/notifications" 
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900"
              >
                <FaBell className="w-6 h-6" />
                <span className="text-xs">Notifications</span>
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none focus:outline-none text-sm w-40"
                />
              </div>

              {/* Notification Bell */}
              <Link 
                to="/notifications" 
                className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              >
                <FaBell className="w-5 h-5" />
              </Link>

              {/* User Profile */}
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={userData?.profileImage || dp} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {userData?.firstName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          
          {/* Left Sidebar - Profile Card */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Enhanced Profile Card */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24'>
              {/* Cover Photo */}
              <div className='h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative'>
                <button 
                  onClick={() => setEdit(true)}
                  className='absolute right-2 top-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all'
                >
                  <CiCamera className='w-4 h-4 text-white' />
                </button>
              </div>
              
              {/* Profile Info */}
              <div className='px-4 pb-4'>
                <div className='flex flex-col items-center -mt-8'>
                  {/* Profile Image */}
                  <div 
                    className='w-16 h-16 rounded-full border-4 border-white overflow-hidden cursor-pointer shadow-lg mb-3'
                    onClick={() => setEdit(true)}
                  >
                    <img 
                      src={userData?.profileImage || dp} 
                      alt="Profile" 
                      className='w-full h-full object-cover'
                    />
                  </div>
                  
                  {/* User Info */}
                  <div className='text-center mb-4'>
                    <h2 className='font-semibold text-gray-900 text-lg leading-tight'>
                      {userData?.firstName} {userData?.lastName}
                    </h2>
                    <p className='text-gray-600 text-sm mt-1 line-clamp-2'>
                      {userData?.headline || "Add a headline to your profile"}
                    </p>
                    <p className='text-gray-500 text-xs flex items-center justify-center mt-1'>
                      <HiLocationMarker className='w-3 h-3 mr-1' />
                      {userData?.location || "Add location"}
                    </p>
                  </div>

                  {/* Profile Stats */}
                  <div className='w-full border-t border-gray-200 pt-3 mb-3'>
                    <div className='flex justify-between text-sm text-gray-600'>
                      <div className='text-center'>
                        <div className='font-semibold text-gray-900'>{userData?.connections || 123}</div>
                        <div>Connections</div>
                      </div>
                      <div className='text-center'>
                        <div className='font-semibold text-gray-900'>{userData?.followers || 45}</div>
                        <div>Followers</div>
                      </div>
                      <div className='text-center'>
                        <div className='font-semibold text-gray-900'>{userPosts.length}</div>
                        <div>Posts</div>
                      </div>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <button 
                    onClick={() => setEdit(true)}
                    className='w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-full font-medium hover:bg-blue-50 transition-colors text-sm flex items-center justify-center'
                  >
                    <FaPencilAlt className='w-3 h-3 mr-2' />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-96'>
              <h3 className='font-semibold text-gray-900 mb-3 flex items-center'>
                <MdWork className="w-4 h-4 mr-2 text-blue-500" />
                Recent Activity
              </h3>
              <div className='space-y-3'>
                {userPosts.slice(0, 2).map(post => (
                  <div key={post.id} className='text-sm text-gray-600'>
                    <p className='font-medium text-gray-900'>Posted: {post.content.substring(0, 50)}...</p>
                    <p className='text-gray-500 text-xs mt-1'>{post.time}</p>
                  </div>
                ))}
                <button 
                  onClick={() => setUploadPost(true)}
                  className='text-blue-500 hover:text-blue-600 text-sm font-medium w-full text-center pt-2 border-t border-gray-200'
                >
                  Share your thoughts
                </button>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className='lg:col-span-6 space-y-4'>
            {/* Enhanced Create Post Card */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
              <div className='flex items-center space-x-3 mb-3'>
                <div className='w-12 h-12 rounded-full overflow-hidden'>
                  <img 
                    src={userData?.profileImage || dp} 
                    alt="Profile" 
                    className='w-full h-full object-cover'
                  />
                </div>
                <button 
                  onClick={() => setUploadPost(true)}
                  className='flex-1 text-left px-4 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-600 text-sm'
                >
                  Start a post, {userData?.firstName || 'User'}
                </button>
              </div>
              
              <div className='flex justify-between'>
                <button 
                  onClick={() => setUploadPost(true)}
                  className='flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 flex-1 justify-center'
                >
                  <MdPhotoLibrary className='w-5 h-5 text-green-500' />
                  <span className='text-sm font-medium'>Photo</span>
                </button>
                <button className='flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 flex-1 justify-center'>
                  <MdVideoLibrary className='w-5 h-5 text-purple-500' />
                  <span className='text-sm font-medium'>Video</span>
                </button>
                <button className='flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 flex-1 justify-center'>
                  <MdEvent className='w-5 h-5 text-orange-500' />
                  <span className='text-sm font-medium'>Event</span>
                </button>
                <button className='flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 flex-1 justify-center'>
                  <MdArticle className='w-5 h-5 text-red-500' />
                  <span className='text-sm font-medium'>Article</span>
                </button>
              </div>
            </div>

            {/* Feed Filter Tabs */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
              <div className='flex space-x-4 overflow-x-auto'>
                {['all', 'images', 'popular', 'following'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-50 text-blue-500'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {isLoadingPosts && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading posts...</p>
              </div>
            )}

            {/* Enhanced Posts */}
            {filteredPosts.map((post, index) => {
              const isUserPost = userPosts.some(userPost => userPost.id === post.id);
              
              return (
                <div key={`${post.id}-${index}`} className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md'>
                  {/* Post Header */}
                  <div className='p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
                          <img src={post.user.avatar} alt={post.user.name} className='w-full h-full object-cover' />
                        </div>
                        <div className='min-w-0'>
                          <h3 className='font-semibold text-gray-900 truncate'>{post.user.name}</h3>
                          <p className='text-gray-600 text-sm truncate'>{post.user.title}</p>
                          <div className='flex items-center space-x-1 text-gray-500 text-xs'>
                            <span>{getTimeAgo(post.timestamp)}</span>
                            <span>•</span>
                            <span className='flex items-center'>
                              {getAudienceIcon(post.audience || 'public')}
                              <span className='ml-1'>{getAudienceText(post.audience || 'public')}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className='text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100'>
                        <FaEllipsisH className='w-4 h-4' />
                      </button>
                    </div>
                    
                    {/* Post Content */}
                    <div className='mt-3'>
                      <p className='text-gray-800 leading-relaxed whitespace-pre-line'>{post.content}</p>
                      
                      {/* Hashtags */}
                      {post.hashtags.length > 0 && (
                        <div className='flex flex-wrap gap-2 mt-2'>
                          {post.hashtags.map((tag, tagIndex) => (
                            <span key={tagIndex} className='text-blue-500 text-sm hover:underline cursor-pointer'>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Image */}
                    {post.image && (
                      <div className='mt-3 rounded-lg overflow-hidden border border-gray-200'>
                        <img 
                          src={post.image} 
                          alt="Post content" 
                          className='w-full h-auto max-h-96 object-cover cursor-pointer'
                          onClick={() => window.open(post.image, '_blank')}
                        />
                      </div>
                    )}
                  </div>

                  {/* Post Stats */}
                  <div className='px-4 py-2 border-t border-gray-100 text-sm text-gray-500 flex justify-between'>
                    <div className='flex items-center space-x-4'>
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                    <span>{Math.floor(Math.random() * 1000)} views</span>
                  </div>

                  {/* Post Actions */}
                  <div className='px-4 py-2 border-t border-gray-100 grid grid-cols-4 gap-1'>
                    <button 
                      onClick={() => handleLike(post.id, isUserPost)}
                      className={`flex items-center justify-center space-x-2 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50 ${
                        post.liked ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      {post.liked ? <FaThumbsUp className='w-4 h-4' /> : <FaRegThumbsUp className='w-4 h-4' />}
                      <span className='font-medium'>Like</span>
                    </button>
                    <button className='flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50'>
                      <FaRegComment className='w-4 h-4' />
                      <span className='font-medium'>Comment</span>
                    </button>
                    <button className='flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50'>
                      <FaRegShareSquare className='w-4 h-4' />
                      <span className='font-medium'>Share</span>
                    </button>
                    <button 
                      onClick={() => handleSave(post.id, isUserPost)}
                      className={`flex items-center justify-center space-x-2 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50 ${
                        post.saved ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                      }`}
                    >
                      <FaRegBookmark className='w-4 h-4' />
                      <span className='font-medium'>Save</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* No Posts Message */}
            {!isLoadingPosts && filteredPosts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share something with your network!</p>
                <button 
                  onClick={() => setUploadPost(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Create your first post
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Suggested Connections */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24'>
              <div className='flex justify-between items-center mb-3'>
                <h3 className='font-semibold text-gray-900'>People you may know</h3>
                <button className='text-gray-500 hover:text-gray-700'>
                  <FaEllipsisH className='w-4 h-4' />
                </button>
              </div>
              <div className='space-y-4'>
                {suggestedConnections.map(connection => (
                  <div key={connection.id} className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
                        <img src={connection.avatar} alt={connection.name} className='w-full h-full object-cover' />
                      </div>
                      <div className='min-w-0'>
                        <p className='font-medium text-sm text-gray-900 truncate'>{connection.name}</p>
                        <p className='text-gray-500 text-xs truncate'>{connection.title}</p>
                        <p className='text-gray-400 text-xs'>{connection.mutualConnections} mutual connections</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleConnect(connection.id)}
                      className='text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-sm hover:bg-blue-50 transition-colors whitespace-nowrap'
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
              <button className='w-full text-center text-blue-500 hover:text-blue-600 text-sm font-medium mt-3 pt-3 border-t border-gray-200'>
                Show more
              </button>
            </div>

            {/* Enhanced Trending News */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
              <h3 className='font-semibold text-gray-900 mb-3'>LinkedIn News</h3>
              <div className='space-y-3'>
                {trendingNews.map(news => (
                  <div key={news.id} className='text-sm cursor-pointer group'>
                    <p className='font-medium text-gray-900 group-hover:text-blue-500 transition-colors'>
                      {news.title}
                    </p>
                    <p className='text-gray-500 text-xs mt-1 line-clamp-2'>{news.description}</p>
                    <p className='text-gray-400 text-xs mt-1'>{news.time} • {news.readers} readers</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Courses */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
              <h3 className='font-semibold text-gray-900 mb-3 flex items-center'>
                <MdSchool className="w-4 h-4 mr-2 text-purple-500" />
                Today's Courses
              </h3>
              <div className='space-y-3'>
                {[
                  { title: "Advanced React Patterns", viewers: "12,345" },
                  { title: "Cloud Architecture", viewers: "8,432" },
                  { title: "Data Science Basics", viewers: "15,678" }
                ].map((course, index) => (
                  <div key={index} className='text-sm cursor-pointer group'>
                    <p className='font-medium text-gray-900 group-hover:text-blue-500 transition-colors'>
                      {course.title}
                    </p>
                    <p className='text-gray-500 text-xs mt-1'>{course.viewers} viewers</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Create Post Modal */}
      {uploadPost && (
        <>
          <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={() => !loading && setUploadPost(false)}></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl z-50 max-h-[90vh] overflow-hidden'>
            <div className='p-6'>
              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-semibold text-gray-900'>Create a post</h2>
                <button 
                  onClick={() => !loading && setUploadPost(false)}
                  className='text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50'
                  disabled={loading}
                >
                  <GiSplitCross className='w-6 h-6' />
                </button>
              </div>

              {/* User Info */}
              <div className='flex items-center space-x-3 mb-4'>
                <div className='w-12 h-12 rounded-full overflow-hidden'>
                  <img 
                    src={userData?.profileImage || dp} 
                    alt="Profile" 
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    {userData?.firstName} {userData?.lastName}
                  </h3>
                  <select 
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className='text-sm text-gray-600 border-none bg-transparent focus:outline-none cursor-pointer'
                    disabled={loading}
                  >
                    <option value="public">Anyone</option>
                    <option value="connections">Connections only</option>
                    <option value="private">No one</option>
                  </select>
                </div>
              </div>

              {/* Post Content */}
              <div className='max-h-96 overflow-y-auto'>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What do you want to talk about?"
                  className='w-full h-32 resize-none border-none focus:outline-none text-lg placeholder-gray-500'
                  disabled={loading}
                />

                {/* Image Preview */}
                {frontendImage && (
                  <div className='mt-4 relative'>
                    <img src={frontendImage} alt="Post content" className='w-full max-h-80 object-cover rounded-lg' />
                    <button 
                      onClick={() => {
                        setFrontendImage("");
                        setBackendImage(null);
                      }}
                      className='absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 disabled:opacity-50'
                      disabled={loading}
                    >
                      <GiSplitCross className='w-4 h-4' />
                    </button>
                  </div>
                )}
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-6 z-10">
                  <EmojiPicker 
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                  />
                </div>
              )}

              {/* Post Options */}
              <div className='flex items-center justify-between mt-4 p-3 border border-gray-200 rounded-lg'>
                <span className='text-sm text-gray-600'>Add to your post</span>
                <div className='flex items-center space-x-2'>
                  <input type="file" ref={image} hidden onChange={handleImage} accept="image/*" disabled={loading} />
                  <button 
                    onClick={() => image.current.click()}
                    className='p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50'
                    disabled={loading}
                  >
                    <FaImages className='w-5 h-5' />
                  </button>
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className='p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50'
                    disabled={loading}
                  >
                    <FaSmile className='w-5 h-5' />
                  </button>
                  <button className='p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50' disabled={loading}>
                    <FaCalendarAlt className='w-5 h-5' />
                  </button>
                </div>
              </div>

              {/* Character Count */}
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${description.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
                  {description.length}/1000
                </span>
              </div>

              {/* Post Button */}
              <button
                onClick={handleUploadPost}
                disabled={(!description.trim() && !backendImage) || loading || description.length > 1000}
                className={`w-full mt-4 py-3 rounded-full font-semibold transition-colors flex items-center justify-center ${
                  (description.trim() || backendImage) && !loading && description.length <= 1000
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Home