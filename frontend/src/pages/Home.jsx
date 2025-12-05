import React, { useState, useRef, useEffect } from 'react'
import Nav from '../components/Nav'
// Avatar fallback - using a data URI for a simple placeholder avatar
const dp = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzYTc5YjciLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIyMCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zMCA3MEwyNSA5MGg1MEw3MCA3MHoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
import { CiCirclePlus, CiCamera } from "react-icons/ci";
import { useUserData } from '../context/UserContext';
import { FaPencilAlt, FaEllipsisH, FaRegComment, FaRegShareSquare, FaRegBookmark, FaRegSmile, FaTrash, FaEnvelope } from "react-icons/fa";
import { MdPhotoLibrary, MdVideoLibrary, MdEvent, MdArticle, MdWork, MdSchool, MdPublic } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import EditProfile from '../components/EditProfile';
import { GiSplitCross } from "react-icons/gi";
import { FaImages, FaSmile, FaCalendarAlt, FaBell, FaUsers, FaRegHeart, FaHeart, FaRegThumbsUp, FaThumbsUp, FaLinkedin } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

// Shared posts data structure for demo users
const sharedPosts = [
  // Krishna's posts
  {
    id: 'post_krishna_1',
    userId: 'user_krishna',
    user: {
      name: 'Krishna Patil Rajput',
      title: 'Senior Full Stack Developer & Tech Evangelist at TechSolutions Inc',
      avatar: dp,
      company: 'TechSolutions Inc',
      connectionLevel: '1st'
    },
    content: 'Just deployed a new microservice architecture that reduced our API response time by 40%! Excited to share this achievement with the community. #microservices #performance #backend',
    time: '2h ago',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 45,
    comments: 12,
    commentsList: [
      {
        id: 'comment_krishna_1_1',
        user: {
          name: 'Atharva Patil Rajput',
          avatar: dp
        },
        text: 'Amazing work Krishna! This is exactly what our team needs.',
        timestamp: new Date(Date.now() - 120 * 60 * 1000)
      },
      {
        id: 'comment_krishna_1_2',
        user: {
          name: 'Ankush Khakale',
          avatar: dp
        },
        text: 'Can you share some details about the architecture?',
        timestamp: new Date(Date.now() - 90 * 60 * 1000)
      }
    ],
    shares: 5,
    liked: false,
    saved: false,
    type: 'update',
    image: null,
    hashtags: ['microservices', 'performance', 'backend']
  },
  {
    id: 'post_krishna_2',
    userId: 'user_krishna',
    user: {
      name: 'Krishna Patil Rajput',
      title: 'Senior Full Stack Developer & Tech Evangelist at TechSolutions Inc',
      avatar: dp,
      company: 'TechSolutions Inc',
      connectionLevel: '1st'
    },
    content: 'Working on an exciting new React project with cutting-edge features. The team is doing an amazing job implementing real-time collaboration. #react #webdevelopment #teamwork',
    time: '1d ago',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 89,
    comments: 23,
    commentsList: [
      {
        id: 'comment_krishna_2_1',
        user: {
          name: 'Mahesh Vispute',
          avatar: dp
        },
        text: 'Looks promising! How is the backend integration going?',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000)
      }
    ],
    shares: 8,
    liked: true,
    saved: true,
    type: 'project',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['react', 'webdevelopment', 'teamwork']
  },
  // Atharva's posts
  {
    id: 'post_atharva_1',
    userId: 'user_atharva',
    user: {
      name: 'Atharva Patil Rajput',
      title: 'Software Engineer & AI/ML Specialist at AI Innovations Ltd',
      avatar: dp,
    },
    content: 'Published a new research paper on neural networks and their applications in natural language processing. Proud of what our research team accomplished! #machinelearning #nlp #research',
    time: '4h ago',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 156,
    comments: 34,
    commentsList: [
      {
        id: 'comment_atharva_1_1',
        user: {
          name: 'Krishna Patil Rajput',
          avatar: dp
        },
        text: 'Congratulations on the publication! This is groundbreaking work.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 'comment_atharva_1_2',
        user: {
          name: 'Ankush Khakale',
          avatar: dp
        },
        text: 'Very interesting approach to NLP. Would love to collaborate on future projects!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    shares: 12,
    liked: false,
    saved: false,
    type: 'achievement',
    image: null,
    hashtags: ['machinelearning', 'nlp', 'research']
  },
  // Ankush's posts
  {
    id: 'post_ankush_1',
    userId: 'user_ankush',
    user: {
      name: 'Ankush Khakale',
      title: 'Frontend Developer & UI/UX Designer at DesignTech Systems',
      avatar: dp,
    },
    content: 'Designed a new user interface for our flagship product that increased user engagement by 35%. The design process was challenging but rewarding. #uiux #design #userexperience',
    time: '6h ago',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 78,
    comments: 19,
    commentsList: [
      {
        id: 'comment_ankush_1_1',
        user: {
          name: 'Mahesh Vispute',
          avatar: dp
        },
        text: 'Beautiful design! How did you handle responsive layouts?',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ],
    shares: 7,
    liked: true,
    saved: false,
    type: 'design',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['uiux', 'design', 'userexperience']
  },
  // Mahesh's posts
  {
    id: 'post_mahesh_1',
    userId: 'user_mahesh',
    user: {
      name: 'Mahesh Vispute',
      title: 'Backend Engineer & Database Specialist at DataSystems Pvt Ltd',
      avatar: dp,
    },
    content: 'Optimized our database queries and implemented caching strategies that improved system performance by 60%. Database optimization is truly an art! #database #optimization #backend',
    time: '8h ago',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 112,
    comments: 28,
    commentsList: [
      {
        id: 'comment_mahesh_1_1',
        user: {
          name: 'Krishna Patil Rajput',
          avatar: dp
        },
        text: 'Impressive results! Can you share the optimization techniques you used?',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000)
      },
      {
        id: 'comment_mahesh_1_2',
        user: {
          name: 'Atharva Patil Rajput',
          avatar: dp
        },
        text: 'This is exactly what we need for our ML pipeline. Great work!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ],
    shares: 9,
    liked: false,
    saved: true,
    type: 'technical',
    image: null,
    hashtags: ['database', 'optimization', 'backend']
  }
];

function Home() {
  let { userData, setUserData } = useUserData()
  let [edit, setEdit] = useState(false)

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
  const [commentInputs, setCommentInputs] = useState({}); // Track comment inputs for each post
  const [showComments, setShowComments] = useState({}); // Track which posts have comments shown

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

  // Update trending news every 2 seconds
  useEffect(() => {
    const newsInterval = setInterval(() => {
      loadTrendingNews();
    }, 2000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(newsInterval);
  }, []);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('sharedPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        // Merge saved posts with hardcoded posts to preserve demo data
        // But prioritize saved posts (user-generated content) over hardcoded ones
        const mergedPosts = [...sharedPosts]; // Start with hardcoded posts
        
        // Update hardcoded posts with any saved data
        parsedPosts.forEach(savedPost => {
          const existingIndex = mergedPosts.findIndex(post => post.id === savedPost.id);
          if (existingIndex !== -1) {
            // Update existing post with saved data
            mergedPosts[existingIndex] = savedPost;
          } else {
            // Add new post if it doesn't exist
            mergedPosts.push(savedPost);
          }
        });
        
        // Update the sharedPosts array
        sharedPosts.length = 0;
        sharedPosts.push(...mergedPosts);
        // Update state
        setPosts(mergedPosts);
      } catch (error) {
        console.error('Failed to parse saved posts:', error);
        // Fallback to hardcoded posts
        setPosts(sharedPosts);
      }
    } else {
      // No saved posts, use hardcoded posts
      setPosts(sharedPosts);
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    // Only save user-created posts (not the hardcoded demo posts)
    const userCreatedPosts = posts.filter(post => 
      ![
        'post_krishna_1', 'post_krishna_2', 'post_atharva_1', 'post_mahesh_1', 'post_ankush_1'
      ].includes(post.id)
    );
    
    if (userCreatedPosts.length > 0) {
      try {
        localStorage.setItem('sharedPosts', JSON.stringify(userCreatedPosts));
      } catch (error) {
        console.error('Failed to save posts to localStorage:', error);
      }
    }
    // Note: We don't remove the item from localStorage when there are no user-created posts
    // This ensures that if all user posts are deleted, the empty state persists across reloads
  }, [posts]);

  // Function to save shared posts to localStorage
  const saveSharedPostsToLocalStorage = () => {
    try {
      // Get user-created posts (excluding hardcoded demo posts)
      const userCreatedPosts = sharedPosts.filter(post => 
        ![
          'post_krishna_1', 'post_krishna_2', 'post_atharva_1', 'post_mahesh_1', 'post_ankush_1'
        ].includes(post.id)
      );
      
      if (userCreatedPosts.length > 0) {
        localStorage.setItem('sharedPosts', JSON.stringify(userCreatedPosts));
      }
      // Note: We don't remove the item from localStorage when there are no user-created posts
      // This ensures that if all user posts are deleted, the empty state persists across reloads
    } catch (error) {
      console.error('Failed to save shared posts to localStorage:', error);
    }
  };

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
    // Load posts from all demo users
    setPosts(sharedPosts);
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
    // Generate random news
    const newsTitles = [
      "Remote work trends in 2024",
      "AI transforming industries",
      "Sustainable business practices",
      "Blockchain adoption accelerating",
      "Cybersecurity threats on the rise",
      "Quantum computing breakthrough",
      "Green energy investments surge",
      "Digital nomad lifestyle growing",
      "5G networks expanding globally",
      "Cryptocurrency market volatility",
      "E-commerce sales hit record highs",
      "Cloud computing cost optimization",
      "Machine learning in healthcare",
      "Remote collaboration tools evolve",
      "Data privacy regulations tighten"
    ];
    
    const newsDescriptions = [
      "How companies are adapting to hybrid models",
      "Latest developments in artificial intelligence",
      "Companies leading in environmental initiatives",
      "New applications in finance and supply chain",
      "Protecting digital assets in modern era",
      "Potential to revolutionize computing power",
      "Renewable sources driving economic growth",
      "Work-life balance in the digital age",
      "Faster connectivity enabling new technologies",
      "Market fluctuations impact investor strategies",
      "Online shopping continues exponential growth",
      "Efficient resource management in cloud",
      "Diagnostic tools improving patient outcomes",
      "Virtual meetings become more immersive",
      "Compliance challenges for global businesses"
    ];
    
    // Generate 3 random news items
    const news = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * newsTitles.length);
      const randomTime = Math.floor(Math.random() * 24) + 1;
      const randomReaders = Math.floor(Math.random() * 50000) + 1000;
      
      news.push({
        id: Date.now() + i, // Unique ID
        title: newsTitles[randomIndex],
        description: newsDescriptions[randomIndex],
        time: `${randomTime}h ago`,
        readers: randomReaders.toLocaleString()
      });
    }
    
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
      
      // Convert file to data URL for persistence
      const reader = new FileReader();
      reader.onload = (event) => {
        setFrontendImage(event.target.result);
      };
      reader.readAsDataURL(file)
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
        id: `post_${authData.user?.id || 'user'}_${Date.now()}`, // Unique ID with user prefix
        userId: authData.user?.id || 'current_user',
        user: {
          name: `${authData.user?.firstName || userData?.firstName} ${authData.user?.lastName || userData?.lastName}`,
          title: authData.user?.headline || userData?.headline || "Professional",
          avatar: authData.user?.profileImage || userData?.profileImage || dp,
          company: authData.user?.company || userData?.company || "",
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

      // Add to shared posts so all demo users can see it
      sharedPosts.unshift(newPost);
      
      // Update the posts state to include the new post
      setPosts(prev => [newPost, ...prev]);

      // Add to user posts
      setUserPosts(prev => [newPost, ...prev]);

      // Save to localStorage immediately
      try {
        // Get existing saved posts
        const savedPosts = localStorage.getItem('sharedPosts');
        const existingPosts = savedPosts ? JSON.parse(savedPosts) : [];
        
        // Add new post to existing posts
        const updatedPosts = [newPost, ...existingPosts];
        
        // Save back to localStorage
        localStorage.setItem('sharedPosts', JSON.stringify(updatedPosts));
      } catch (error) {
        console.error('Failed to save post to localStorage:', error);
      }

      // Reset form
      setUploadPost(false);
      setDescription("");
      setFrontendImage("");
      setBackendImage(null);
      setAudience('public');
      setShowEmojiPicker(false);

      // Show success message
      alert('Post created successfully! Other demo users will see your post too. (Demo Mode)');

    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Modify the handleLike function to also save to localStorage
  const handleLike = (postId, isUserPost = false) => {
    // Update UI immediately without API call
    
    // Update the shared posts data
    const postIndex = sharedPosts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      const currentLiked = sharedPosts[postIndex].liked;
      sharedPosts[postIndex].likes = currentLiked ? sharedPosts[postIndex].likes - 1 : sharedPosts[postIndex].likes + 1;
      sharedPosts[postIndex].liked = !currentLiked;
      
      // Save updated posts to localStorage
      saveSharedPostsToLocalStorage();
    }
    
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

  const handleCommentChange = (postId, text) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  const handleAddComment = (postId, isUserPost = false) => {
    const commentText = commentInputs[postId];
    if (!commentText || commentText.trim() === '') return;

    // Generate a more unique ID using timestamp and a counter
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    const uniqueCounter = Math.floor(Math.random() * 100000);
    const newComment = {
      id: `comment_${postId}_${timestamp}_${randomString}_${uniqueCounter}`,
      user: {
        name: `${authData.user?.firstName} ${authData.user?.lastName}`,
        avatar: authData.user?.profileImage || dp
      },
      text: commentText,
      timestamp: new Date()
    };

    // Update the shared posts data
    const postIndex = sharedPosts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      if (!sharedPosts[postIndex].commentsList) {
        sharedPosts[postIndex].commentsList = [];
      }
      sharedPosts[postIndex].commentsList.push(newComment);
      sharedPosts[postIndex].comments = sharedPosts[postIndex].commentsList.length;
      
      // Save updated posts to localStorage
      saveSharedPostsToLocalStorage();
    }

    // Update UI
    if (isUserPost) {
      setUserPosts(posts => posts.map(post =>
        post.id === postId
          ? {
            ...post,
            comments: post.commentsList ? post.commentsList.length + 1 : 1,
            commentsList: post.commentsList ? [...post.commentsList, newComment] : [newComment]
          }
          : post
      ));
    } else {
      setPosts(posts => posts.map(post =>
        post.id === postId
          ? {
            ...post,
            comments: post.commentsList ? post.commentsList.length + 1 : 1,
            commentsList: post.commentsList ? [...post.commentsList, newComment] : [newComment]
          }
          : post
      ));
    }

    // Clear comment input
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Format time for comments
  const formatTime = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Modify the handleShare function to also save to localStorage
  const handleShare = (postId, isUserPost = false) => {
    // Update the shared posts data
    const postIndex = sharedPosts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      sharedPosts[postIndex].shares += 1;
      
      // Save updated posts to localStorage
      saveSharedPostsToLocalStorage();
    }
    
    // Update UI
    if (isUserPost) {
      setUserPosts(posts => posts.map(post =>
        post.id === postId
          ? {
            ...post,
            shares: post.shares + 1
          }
          : post
      ));
    } else {
      setPosts(posts => posts.map(post =>
        post.id === postId
          ? {
            ...post,
            shares: post.shares + 1
          }
          : post
      ));
    }
    
    // Show confirmation
    alert('Post shared successfully! (Demo Mode)');
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

  const handleDelete = (postId, isUserPost = false) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    // Update UI immediately without API call
    if (isUserPost) {
      setUserPosts(posts => posts.filter(post => post.id !== postId));
    } else {
      setPosts(posts => posts.filter(post => post.id !== postId));
    }
    
    // Also remove from sharedPosts if it's there
    const sharedPostIndex = sharedPosts.findIndex(post => post.id === postId);
    if (sharedPostIndex !== -1) {
      sharedPosts.splice(sharedPostIndex, 1);
    }
    
    // Remove from localStorage as well
    try {
      const savedPosts = localStorage.getItem('sharedPosts');
      if (savedPosts) {
        const existingPosts = JSON.parse(savedPosts);
        const updatedPosts = existingPosts.filter(post => post.id !== postId);
        // Only save back to localStorage if there are still posts remaining
        // If all user posts are deleted, we still save an empty array to maintain the deleted state
        localStorage.setItem('sharedPosts', JSON.stringify(updatedPosts));
      }
    } catch (error) {
      console.error('Failed to remove post from localStorage:', error);
    }
    
    alert('Post deleted successfully!');
  };

  // Handle messaging a user from a post
  const handleMessageFromPost = (postUserId, postUserName) => {
    // Navigate to messages page with the user ID
    navigate(`/messages?userId=${postUserId}`);
  };

  // Check if the current user is the owner of the post
  const isPostOwner = (postUserId) => {
    return authData.user?.id === postUserId;
  };

  // Check if we can message the post author (not ourselves)
  const canMessageUser = (postUserId) => {
    return authData.user?.id !== postUserId;
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
      {edit && <EditProfile setEdit={setEdit} />}

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
                  <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7z" />
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
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
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
                      <div className='flex space-x-1'>
                        {canMessageUser(post.userId) && (
                          <button 
                            onClick={() => handleMessageFromPost(post.userId, post.user.name)}
                            className='text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50'
                            title='Message user'
                          >
                            <FaEnvelope className='w-4 h-4' />
                          </button>
                        )}
                        {isPostOwner(post.userId) && (
                          <button 
                            onClick={() => handleDelete(post.id, isUserPost)}
                            className='text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50'
                            title='Delete post'
                          >
                            <FaTrash className='w-4 h-4' />
                          </button>
                        )}
                      </div>
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
                  <div className='px-4 py-2 border-t border-gray-100 grid grid-cols-5 gap-1'>
                    <button
                      onClick={() => handleLike(post.id, isUserPost)}
                      className={`flex items-center justify-center space-x-2 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50 ${post.liked ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                        }`}
                    >
                      {post.liked ? <FaThumbsUp className='w-4 h-4' /> : <FaRegThumbsUp className='w-4 h-4' />}
                      <span className='font-medium'>Like</span>
                    </button>
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className='flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50'
                    >
                      <FaRegComment className='w-4 h-4' />
                      <span className='font-medium'>Comment</span>
                    </button>
                    <button 
                      onClick={() => handleShare(post.id, isUserPost)}
                      className='flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50'
                    >
                      <FaRegShareSquare className='w-4 h-4' />
                      <span className='font-medium'>Share</span>
                    </button>
                    <button
                      onClick={() => handleMessageFromPost(post.userId, post.user.name)}
                      className='flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50'
                      disabled={!canMessageUser(post.userId)}
                    >
                      <FaEnvelope className='w-4 h-4' />
                      <span className='font-medium'>Message</span>
                    </button>
                    <button
                      onClick={() => handleSave(post.id, isUserPost)}
                      className={`flex items-center justify-center space-x-2 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50 ${post.saved ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                        }`}
                    >
                      <FaRegBookmark className='w-4 h-4' />
                      <span className='font-medium'>Save</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {showComments[post.id] && (
                    <div className='px-4 py-3 border-t border-gray-100 bg-gray-50'>
                      {/* Existing Comments */}
                      {post.commentsList && post.commentsList.map((comment, commentIndex) => (
                        <div key={`${comment.id}-${commentIndex}`} className='flex space-x-3 mb-3'>
                          <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
                            <img 
                              src={comment.user.avatar || dp} 
                              alt={comment.user.name} 
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <div className='flex-1'>
                            <div className='bg-white rounded-lg px-3 py-2 shadow-sm'>
                              <p className='font-medium text-sm text-gray-900'>{comment.user.name}</p>
                              <p className='text-sm text-gray-700'>{comment.text}</p>
                            </div>
                            <div className='flex space-x-3 mt-1 text-xs text-gray-500'>
                              <button className='hover:text-gray-700'>Like</button>
                              <button className='hover:text-gray-700'>Reply</button>
                              <span>{formatTime(comment.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      <div className='flex space-x-3 mt-3'>
                        <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
                          <img 
                            src={authData.user?.profileImage || dp} 
                            alt={`${authData.user?.firstName} ${authData.user?.lastName}`} 
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1 flex'>
                          <input
                            type='text'
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            placeholder='Add a comment...'
                            className='flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id, isUserPost);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(post.id, isUserPost)}
                            disabled={!commentInputs[post.id] || commentInputs[post.id]?.trim() === ''}
                            className='ml-2 bg-blue-500 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                className={`w-full mt-4 py-3 rounded-full font-semibold transition-colors flex items-center justify-center ${(description.trim() || backendImage) && !loading && description.length <= 1000
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