import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { UserContext } from '../context/userContext';
import { useAuth } from '/src/context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import FollowersFollowing from '../components/FollowersFollowing';
import dp from "../assets/dp.webp";
import { Link } from 'react-router-dom';
import { CiCamera, CiCirclePlus, CiWarning, CiLogout } from "react-icons/ci";
import { GiSplitCross } from "react-icons/gi";
import { 
  FaCheck, 
  FaExclamationTriangle, 
  FaLinkedin, 
  FaGithub, 
  FaTwitter,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaCog,
  FaUserPlus,
  FaShare,
  FaDownload,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { 
  MdEmail, 
  MdLanguage, 
  MdLocationOn,
  MdWork,
  MdSchool,
  MdDelete,
  MdAdd,
  MdEdit,
  MdSave,
  MdCancel
} from "react-icons/md";
import axios from 'axios';

function Profile() {
  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl, authData, setAuthData } = useContext(authDataContext);
  const navigate = useNavigate();
  
  const [showConnections, setShowConnections] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
    current: false
  });
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: ""
  });
  const [activeTab, setActiveTab] = useState('about');
  const [posts, setPosts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profileStrength, setProfileStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState({ profile: 0, cover: 0 });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    emailVisibility: 'connections',
    phoneVisibility: 'private',
    activityStatus: true
  });
  const [exportLoading, setExportLoading] = useState(false);

  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  // Krishna Patil Rajput's personal data
  const krishnaData = {
    firstName: "Krishna",
    lastName: "Patil Rajput",
    userName: "krishnapatil",
    profileImage: null,
    coverImage: null,
    headline: "Full Stack Developer & Tech Enthusiast",
    location: "Pune, Maharashtra, India",
    email: "krishna.patil@example.com",
    phone: "+91 98765 43210",
    website: "https://krishnablogy.blogspot.com",
    bio: "Passionate Full Stack Developer with expertise in React, Node.js, and modern web technologies. I love building scalable applications and sharing knowledge through my blog. Always eager to learn new technologies and contribute to innovative projects.",
    skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "Express.js", "HTML5", "CSS3", "Tailwind CSS", "Git", "REST APIs", "AWS"],
    experience: [
      {
        id: 1,
        title: "Full Stack Developer",
        company: "TechSolutions Inc",
        location: "Pune, India",
        startDate: "2022-03",
        endDate: null,
        current: true,
        description: "Developing and maintaining web applications using React and Node.js. Implementing responsive designs and optimizing application performance."
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "WebCraft Studios",
        location: "Mumbai, India",
        startDate: "2021-01",
        endDate: "2022-02",
        current: false,
        description: "Built interactive user interfaces and collaborated with design teams to create seamless user experiences."
      }
    ],
    education: [
      {
        id: 1,
        school: "University of Pune",
        degree: "Bachelor of Computer Science",
        field: "Computer Science",
        startDate: "2018-06",
        endDate: "2021-05",
        current: false,
        description: "Graduated with distinction. Focused on software engineering, algorithms, and web technologies."
      }
    ],
    socialLinks: {
      linkedin: "krishna-patil-rajput",
      github: "krishnapatil",
      twitter: "krishnapatil"
    },
    followersCount: 324,
    followingCount: 156,
    connectionsCount: 287,
    joinedDate: "2021-06-15",
    lastActive: new Date().toISOString(),
    privacySettings: {
      profileVisibility: 'public',
      emailVisibility: 'connections',
      phoneVisibility: 'private',
      activityStatus: true
    }
  };

  const displayData = userData || krishnaData;

  // Calculate profile strength
  const calculateProfileStrength = useCallback((data) => {
    let strength = 0;
    const maxPoints = 100;
    
    if (data.firstName && data.lastName) strength += 15;
    if (data.headline) strength += 10;
    if (data.bio && data.bio.length > 50) strength += 10;
    if (data.profileImage) strength += 10;
    if (data.coverImage) strength += 5;
    if (data.location) strength += 5;
    if (data.email) strength += 5;
    if (data.skills && data.skills.length >= 3) strength += 10;
    if (data.experience && data.experience.length > 0) strength += 15;
    if (data.education && data.education.length > 0) strength += 10;
    if (data.socialLinks && Object.keys(data.socialLinks).length > 0) strength += 5;
    
    return Math.min(strength, maxPoints);
  }, []);

  // Initialize edit form when editing starts
  useEffect(() => {
    if (isEditing) {
      setEditForm({ ...displayData });
      setProfileStrength(calculateProfileStrength(displayData));
      setPrivacySettings(displayData.privacySettings || privacySettings);
    }
  }, [isEditing, displayData, calculateProfileStrength]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoSaveTimer, hasUnsavedChanges]);

  // Generate sample posts
  useEffect(() => {
    const samplePosts = [
      {
        id: 1,
        content: "Just deployed a new feature using React and Node.js! 🚀 The performance improvements are amazing. #webdev #react #nodejs",
        likes: 24,
        comments: 8,
        shares: 3,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "post"
      },
      {
        id: 2,
        content: "Excited to share my latest blog post about modern web development on my blog! Check it out: https://krishnablogy.blogspot.com",
        likes: 56,
        comments: 12,
        shares: 15,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: "post"
      }
    ];
    setPosts(samplePosts);
  }, []);

  // Test API connection
  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/test`, {
        withCredentials: true,
        timeout: 5000
      });
      console.log("✅ API connection successful");
    } catch (error) {
      console.warn("⚠️ API connection test failed");
    }
  };

  // Fixed logout function
  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Clear context state
      setUserData(null);
      if (setAuthData) {
        setAuthData({
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
      
      // Call backend logout if endpoint exists
      try {
        await axios.post(`${serverUrl}/api/auth/logout`, {}, {
          withCredentials: true
        });
      } catch (error) {
        console.log('Backend logout optional');
      }
      
      // Navigate to login
      navigate('/login');
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      localStorage.clear();
      navigate('/login');
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website) && formData.website !== '') {
      errors.website = "Please enter a valid website URL";
    }
    
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    return errors;
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => {
      const newForm = { ...prev, [field]: value };
      
      setProfileStrength(calculateProfileStrength(newForm));
      setHasUnsavedChanges(true);
      
      const errors = validateForm(newForm);
      setValidationErrors(errors);
      
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      setAutoSaveTimer(Date.now());
      
      return newForm;
    });
  };

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges) return;
    
    const errors = validateForm(editForm);
    if (Object.keys(errors).length > 0) return;
    
    await handleSaveProfile(true);
  };

  const handleSaveProfile = async (isAutoSave = false) => {
    setSaving(true);
    setError("");
    
    const errors = validateForm(editForm);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please fix the validation errors before saving");
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Add text fields
      const textFields = {
        firstName: editForm.firstName || "",
        lastName: editForm.lastName || "",
        userName: editForm.userName || "",
        headline: editForm.headline || "",
        location: editForm.location || "",
        bio: editForm.bio || "",
        email: editForm.email || "",
        phone: editForm.phone || "",
        website: editForm.website || "",
        skills: JSON.stringify(editForm.skills || []),
        education: JSON.stringify(editForm.education || []),
        experience: JSON.stringify(editForm.experience || []),
        socialLinks: JSON.stringify(editForm.socialLinks || {}),
        privacySettings: JSON.stringify(privacySettings)
      };

      Object.entries(textFields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add files
      if (editForm.profileImageFile) {
        formData.append("profileImage", editForm.profileImageFile);
      }
      
      if (editForm.coverImageFile) {
        formData.append("coverImage", editForm.coverImageFile);
      }

      const result = await axios.put(
        `${serverUrl}/api/user/updateprofile`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 15000,
          onUploadProgress: (progressEvent) => {
            if (editForm.profileImageFile || editForm.coverImageFile) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setImageUploadProgress({
                profile: editForm.profileImageFile ? progress : 0,
                cover: editForm.coverImageFile ? progress : 0
              });
            }
          }
        }
      );
      
      if (result.data.success) {
        setUserData(result.data.user);
        if (!isAutoSave) {
          setIsEditing(false);
          setSuccessMessage("Profile updated successfully! ✅");
          setTimeout(() => setSuccessMessage(""), 5000);
        } else {
          setSuccessMessage("Auto-saved successfully! 🔄");
          setTimeout(() => setSuccessMessage(""), 2000);
        }
        setHasUnsavedChanges(false);
        setError("");
      } else {
        setError(result.data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error.code === 'NETWORK_ERROR') {
        errorMessage = "Network error: Cannot connect to server.";
      } else if (error.response?.status === 404) {
        errorMessage = "Server endpoint not found.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
      setImageUploadProgress({ profile: 0, cover: 0 });
    }
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
      return;
    }
    setEditForm({ ...displayData });
    setIsEditing(false);
    setError("");
    setHasUnsavedChanges(false);
    setValidationErrors({});
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dataStr = JSON.stringify(displayData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `krishna-patil-rajput-profile-data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccessMessage("Profile data exported successfully! 📥");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError("Failed to export data");
    } finally {
      setExportLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !editForm.skills?.includes(newSkill.trim())) {
      setEditForm(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
    setHasUnsavedChanges(true);
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('profileImage', e.target.result);
        handleInputChange('profileImageFile', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Cover image size should be less than 10MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('coverImage', e.target.result);
        handleInputChange('coverImageFile', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (newExperience.title && newExperience.company) {
      const experienceToAdd = {
        id: Date.now(),
        ...newExperience,
        endDate: newExperience.current ? null : newExperience.endDate
      };
      setEditForm(prev => ({
        ...prev,
        experience: [...(prev.experience || []), experienceToAdd]
      }));
      setNewExperience({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveExperience = (index) => {
    setEditForm(prev => ({
      ...prev,
      experience: prev.experience?.filter((_, i) => i !== index) || []
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (newEducation.school && newEducation.degree) {
      const educationToAdd = {
        id: Date.now(),
        ...newEducation
      };
      setEditForm(prev => ({
        ...prev,
        education: [...(prev.education || []), educationToAdd]
      }));
      setNewEducation({
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveEducation = (index) => {
    setEditForm(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index) || []
    }));
    setHasUnsavedChanges(true);
  };

  const handleSocialLinkChange = (platform, value) => {
    setEditForm(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setHasUnsavedChanges(true);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getProfileStrengthColor = (strength) => {
    if (strength >= 80) return 'bg-green-500';
    if (strength >= 60) return 'bg-blue-500';
    if (strength >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProfileStrengthText = (strength) => {
    if (strength >= 80) return 'Excellent';
    if (strength >= 60) return 'Good';
    if (strength >= 40) return 'Basic';
    return 'Incomplete';
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public': return <FaEye className="w-4 h-4 text-green-500" />;
      case 'connections': return <FaUserPlus className="w-4 h-4 text-blue-500" />;
      case 'private': return <FaEyeSlash className="w-4 h-4 text-gray-500" />;
      default: return <FaEye className="w-4 h-4" />;
    }
  };

  const getVisibilityText = (visibility) => {
    switch (visibility) {
      case 'public': return 'Public';
      case 'connections': return 'Connections Only';
      case 'private': return 'Private';
      default: return visibility;
    }
  };

  // Tabs configuration
  const tabs = [
    { id: 'about', label: 'About', icon: <FaBriefcase /> },
    { id: 'experience', label: 'Experience', icon: <MdWork /> },
    { id: 'education', label: 'Education', icon: <MdSchool /> },
    { id: 'skills', label: 'Skills', icon: <FaCog /> },
    { id: 'privacy', label: 'Privacy', icon: <FaEye /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header with Back and Actions */}
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors font-medium"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          
          <div className="flex space-x-3">
            <button
              onClick={handleExportData}
              disabled={exportLoading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FaDownload className="w-4 h-4" />
              <span>{exportLoading ? 'Exporting...' : 'Export Data'}</span>
            </button>
            
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <CiLogout className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 animate-pulse">
            <FaCheck className="w-5 h-5 text-green-500" />
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Profile Strength Indicator */}
        {isEditing && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Profile Strength</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProfileStrengthColor(profileStrength)} text-white`}>
                {getProfileStrengthText(profileStrength)} - {profileStrength}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getProfileStrengthColor(profileStrength)}`}
                style={{ width: `${profileStrength}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {profileStrength < 60 ? "Add more information to improve your profile visibility" : "Great job! Your profile is well-optimized"}
            </p>
          </div>
        )}

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && isEditing && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-3">
            <CiWarning className="w-5 h-5 text-blue-500" />
            <p className="text-blue-700 font-medium">You have unsaved changes - Auto-save in 5 seconds</p>
          </div>
        )}

        {/* Cover Photo and Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border mb-6 overflow-hidden">
          {/* Cover Photo */}
          <div className="relative">
            <div 
              className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative group cursor-pointer"
              onClick={() => isEditing && coverImageRef.current?.click()}
              style={(isEditing ? editForm.coverImage : displayData.coverImage) ? { 
                backgroundImage: `url(${isEditing ? editForm.coverImage : displayData.coverImage})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              } : {}}
            >
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <CiCamera className='w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                  <span className="text-white opacity-0 group-hover:opacity-100 ml-2">Change Cover</span>
                </div>
              )}
            </div>

            {/* Profile Image */}
            <div className="absolute -bottom-16 left-8">
              <div 
                className="relative group cursor-pointer"
                onClick={() => isEditing && profileImageRef.current?.click()}
              >
                <img 
                  src={isEditing ? (editForm.profileImage || dp) : (displayData.profileImage || dp)} 
                  alt="Krishna Patil Rajput"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-full flex items-center justify-center">
                      <CiCamera className='w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                    </div>
                    <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg'>
                      <CiCirclePlus className='text-white w-4 h-4' />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hidden file inputs */}
            <input type="file" accept='image/*' hidden ref={profileImageRef} onChange={handleProfileImage} />
            <input type="file" accept='image/*' hidden ref={coverImageRef} onChange={handleCoverImage} />
          </div>

          {/* Profile Info Section */}
          <div className="px-8 pb-6 pt-20">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>First Name *</label>
                        <input 
                          type="text"
                          value={editForm.firstName || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required
                        />
                        {validationErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name *</label>
                        <input 
                          type="text"
                          value={editForm.lastName || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required
                        />
                        {validationErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Headline</label>
                      <input 
                        type="text"
                        value={editForm.headline || ''}
                        onChange={(e) => handleInputChange('headline', e.target.value)}
                        placeholder="e.g. Full Stack Developer & Tech Enthusiast"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Username</label>
                      <input 
                        type="text"
                        value={editForm.userName || ''}
                        onChange={(e) => handleInputChange('userName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {displayData.firstName} {displayData.lastName}
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">{displayData.headline}</p>
                    <p className="text-gray-500 mt-1 flex items-center space-x-1">
                      <span>@</span>
                      <span>{displayData.userName}</span>
                    </p>
                    
                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {displayData.location && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          <span>{displayData.location}</span>
                        </div>
                      )}
                      {displayData.email && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaEnvelope className="w-4 h-4" />
                          <span>{displayData.email}</span>
                        </div>
                      )}
                      {displayData.website && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaGlobe className="w-4 h-4" />
                          <a href={displayData.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                            {displayData.website.replace('https://', '')}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Social Links */}
                    {displayData.socialLinks && (
                      <div className="flex space-x-4 mt-3">
                        {displayData.socialLinks.linkedin && (
                          <a 
                            href={`https://linkedin.com/in/${displayData.socialLinks.linkedin}`} 
                            className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaLinkedin className="w-5 h-5" />
                          </a>
                        )}
                        {displayData.socialLinks.github && (
                          <a 
                            href={`https://github.com/${displayData.socialLinks.github}`} 
                            className="text-gray-400 hover:text-gray-600 transition-colors transform hover:scale-110"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaGithub className="w-5 h-5" />
                          </a>
                        )}
                        {displayData.socialLinks.twitter && (
                          <a 
                            href={`https://twitter.com/${displayData.socialLinks.twitter}`} 
                            className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaTwitter className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {!isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-lg flex items-center space-x-2"
                    >
                      <MdEdit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2">
                      <FaShare className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleSaveProfile(false)}
                      disabled={saving}
                      className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                        saving 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-500 hover:bg-green-600 transform hover:scale-[1.02] shadow-lg'
                      } text-white`}
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <MdSave className="w-4 h-4" />
                      )}
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
                    >
                      <MdCancel className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                <div className="flex items-center space-x-2 mb-2">
                  <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                  <p className='text-red-700 text-sm font-medium'>{error}</p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex space-x-8 mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={() => setShowConnections(true)}
                className="text-center hover:text-blue-600 transition-colors cursor-pointer group"
              >
                <div className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                  {displayData.followersCount || 0}
                </div>
                <div className="text-gray-600 text-sm">Followers</div>
              </button>
              
              <button 
                onClick={() => setShowConnections(true)}
                className="text-center hover:text-blue-600 transition-colors cursor-pointer group"
              >
                <div className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                  {displayData.followingCount || 0}
                </div>
                <div className="text-gray-600 text-sm">Following</div>
              </button>

              <button 
                onClick={() => setShowConnections(true)}
                className="text-center hover:text-blue-600 transition-colors cursor-pointer group"
              >
                <div className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                  {displayData.connectionsCount || 0}
                </div>
                <div className="text-gray-600 text-sm">Connections</div>
              </button>

              <div className="text-center group">
                <div className="text-2xl font-bold text-gray-900">🕒</div>
                <div className="text-gray-600 text-sm">
                  {getTimeAgo(displayData.lastActive)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'about' && (
              <div className="space-y-6">
                {isEditing ? (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Bio</label>
                      <textarea
                        value={editForm.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editForm.bio?.length || 0}/500 characters
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                        <input 
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            validationErrors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                        <input 
                          type="tel"
                          value={editForm.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
                      <input 
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Country"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Website</label>
                      <input 
                        type="url"
                        value={editForm.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://krishnablogy.blogspot.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.website ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.website && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.website}</p>
                      )}
                    </div>

                    {/* Social Links */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-3'>Social Links</label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <FaLinkedin className="w-5 h-5 text-blue-600" />
                          <input 
                            type="text"
                            value={editForm.socialLinks?.linkedin || ''}
                            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                            placeholder="LinkedIn username"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaGithub className="w-5 h-5 text-gray-800" />
                          <input 
                            type="text"
                            value={editForm.socialLinks?.github || ''}
                            onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                            placeholder="GitHub username"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <FaTwitter className="w-5 h-5 text-blue-400" />
                          <input 
                            type="text"
                            value={editForm.socialLinks?.twitter || ''}
                            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                            placeholder="Twitter username"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {displayData.bio && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                        <p className="text-gray-700 leading-relaxed">{displayData.bio}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          {displayData.email && (
                            <div className="flex items-center space-x-3">
                              <FaEnvelope className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{displayData.email}</span>
                            </div>
                          )}
                          {displayData.phone && (
                            <div className="flex items-center space-x-3">
                              <FaPhone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{displayData.phone}</span>
                            </div>
                          )}
                          {displayData.location && (
                            <div className="flex items-center space-x-3">
                              <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{displayData.location}</span>
                            </div>
                          )}
                          {displayData.website && (
                            <div className="flex items-center space-x-3">
                              <FaGlobe className="w-4 h-4 text-gray-400" />
                              <a href={displayData.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {displayData.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Social Links */}
                      {(displayData.socialLinks?.linkedin || displayData.socialLinks?.github || displayData.socialLinks?.twitter) && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Profiles</h3>
                          <div className="space-y-2">
                            {displayData.socialLinks.linkedin && (
                              <div className="flex items-center space-x-3">
                                <FaLinkedin className="w-4 h-4 text-blue-600" />
                                <a 
                                  href={`https://linkedin.com/in/${displayData.socialLinks.linkedin}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  LinkedIn
                                </a>
                              </div>
                            )}
                            {displayData.socialLinks.github && (
                              <div className="flex items-center space-x-3">
                                <FaGithub className="w-4 h-4 text-gray-800" />
                                <a 
                                  href={`https://github.com/${displayData.socialLinks.github}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  GitHub
                                </a>
                              </div>
                            )}
                            {displayData.socialLinks.twitter && (
                              <div className="flex items-center space-x-3">
                                <FaTwitter className="w-4 h-4 text-blue-400" />
                                <a 
                                  href={`https://twitter.com/${displayData.socialLinks.twitter}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  Twitter
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Other tabs remain the same but with Krishna's data */}
            {activeTab === 'experience' && (
              <div>
                {isEditing ? (
                  // ... editing experience form (same as before)
                  <div>Experience editing form...</div>
                ) : (
                  <div className="space-y-6">
                    {displayData.experience?.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-gray-600">{exp.company} • {exp.location}</p>
                        <p className="text-gray-500 text-sm">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Similar structure for other tabs */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                {displayData.education?.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">{edu.school}</h4>
                    <p className="text-gray-600">{edu.degree}</p>
                    {edu.field && <p className="text-gray-600">{edu.field}</p>}
                    <p className="text-gray-500 text-sm">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    {edu.description && (
                      <p className="text-gray-700 mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="flex flex-wrap gap-3">
                {displayData.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                {/* Privacy settings content (same as before) */}
                <div>Privacy settings...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50 p-6">
            <div className="text-center">
              <CiLogout className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Logout Confirmation</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout? You'll need to sign in again to access your account.</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Followers/Following Modal */}
      {showConnections && (
        <FollowersFollowing 
          edit={showConnections}
          setEdit={setShowConnections}
        />
      )}
    </div>
  );
}

export default Profile;