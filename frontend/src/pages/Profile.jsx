// pages/Profile.jsx
import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FollowersFollowing from '../components/FollowersFollowing';
import EditProfile from '../components/EditProfile';
import Nav from '../components/Nav';
// Avatar fallback - using a data URI for a simple placeholder avatar
const dp = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzYTc5YjciLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIyMCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zMCA3MEwyNSA5MGg1MEw3MCA3MHoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
import { Link } from 'react-router-dom';
import { CiCamera, CiCirclePlus, CiWarning, CiLogout, CiGlobe } from "react-icons/ci";
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
  FaEyeSlash,
  FaStar,
  FaAward,
  FaCertificate,
  FaLanguage,
  FaTools,
  FaProjectDiagram,
  FaRocket,
  FaCloud,
  FaDatabase,
  FaServer,
  FaMobile,
  FaCode,
  FaPalette,
  FaShieldAlt,
  FaNetworkWired,
  FaRobot,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaCrown,
  FaMedal,
  FaTrophy,
  FaGem,
  FaFire,
  FaBolt,
  FaMagic,
  FaRegHeart,
  FaHeart,
  FaComment,
  FaRetweet,
  FaRegBookmark,
  FaBookmark
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
  MdCancel,
  MdVerified,
  MdTrendingUp,
  MdAnalytics,
  MdComputer,
  MdSecurity,
  MdDesignServices,
  MdApi,
  MdStorage,
  MdCloudQueue,
  MdDevices,
  MdSpeed
} from "react-icons/md";
import {
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiMongodb,
  SiExpress,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiGit,
  SiDocker,
  SiKubernetes,
  SiTypescript,
  SiAmazon,
  SiAwslambda,
  SiAmazons3,
  SiAmazonec2,
  SiAmazondynamodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiGraphql,
  SiSocketdotio,
  SiJest,
  SiCypress,
  SiWebpack,
  SiVite,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiSass,
  SiLess,
  SiFigma,
  SiAdobexd,
  SiSketch
} from "react-icons/si";
import axios from 'axios';

function Profile() {
  const { userData, setUserData } = useContext(UserContext);
  const { authData, setAuthData, logout } = useAuth();
  const navigate = useNavigate();

  const [showConnections, setShowConnections] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profileStrength, setProfileStrength] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [viewMode, setViewMode] = useState('normal');
  const [achievements, setAchievements] = useState([]);
  const [activeSkillFilter, setActiveSkillFilter] = useState('all');
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [profileViews, setProfileViews] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState({ profile: false, cover: false });

  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  // Enhanced user data with more realistic information
  const krishnaData = {
    id: 1,
    firstName: "Krishna",
    lastName: "Patil Rajput",
    userName: "krishnapatil",
    profileImage: null,
    coverImage: null,
    headline: "Senior Full Stack Developer & Tech Evangelist",
    location: "Pune, Maharashtra, India",
    email: "krishna.patil@example.com",
    phone: "+91 98765 43210",
    website: "https://krishnablogy.blogspot.com",
    bio: "🎯 Senior Full Stack Developer with 4+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Passionate about open-source, mentoring, and creating impactful digital solutions. Regular tech blogger and conference speaker.",
    skills: [
      { id: 1, name: "JavaScript", level: "expert", category: "frontend", years: 4, endorsements: 23 },
      { id: 2, name: "React", level: "expert", category: "frontend", years: 3, endorsements: 28 },
      { id: 3, name: "Node.js", level: "expert", category: "backend", years: 3, endorsements: 25 },
      { id: 4, name: "TypeScript", level: "advanced", category: "frontend", years: 2, endorsements: 18 },
      { id: 5, name: "Python", level: "intermediate", category: "backend", years: 2, endorsements: 12 },
      { id: 6, name: "MongoDB", level: "advanced", category: "database", years: 3, endorsements: 15 },
      { id: 7, name: "PostgreSQL", level: "intermediate", category: "database", years: 2, endorsements: 10 },
      { id: 8, name: "Express.js", level: "expert", category: "backend", years: 3, endorsements: 20 },
      { id: 9, name: "HTML5", level: "expert", category: "frontend", years: 4, endorsements: 22 },
      { id: 10, name: "CSS3", level: "expert", category: "frontend", years: 4, endorsements: 21 },
      { id: 11, name: "Tailwind CSS", level: "advanced", category: "frontend", years: 2, endorsements: 16 },
      { id: 12, name: "Git", level: "advanced", category: "tools", years: 4, endorsements: 19 },
      { id: 13, name: "Docker", level: "intermediate", category: "devops", years: 2, endorsements: 11 },
      { id: 14, name: "AWS", level: "intermediate", category: "cloud", years: 2, endorsements: 13 },
      { id: 15, name: "REST APIs", level: "expert", category: "backend", years: 3, endorsements: 24 }
    ],
    experience: [
      {
        id: 1,
        title: "Senior Full Stack Developer",
        company: "TechSolutions Inc",
        location: "Pune, India",
        startDate: "2022-03",
        endDate: null,
        current: true,
        description: "Leading development of enterprise web applications using microservices architecture. Driving technical excellence and mentoring team members.",
        achievements: [
          "Improved application performance by 40% through code optimization and caching strategies",
          "Led a team of 4 developers to deliver projects 15% ahead of schedule",
          "Implemented CI/CD pipeline reducing deployment time from 2 hours to 30 minutes",
          "Introduced TypeScript across codebase, reducing bugs by 25%"
        ],
        technologies: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker", "Redis"],
        companyLogo: null,
        employmentType: "Full-time"
      },
      {
        id: 2,
        title: "Frontend Tech Lead",
        company: "WebCraft Studios",
        location: "Mumbai, India",
        startDate: "2021-01",
        endDate: "2022-02",
        current: false,
        description: "Spearheaded frontend development and established design systems for multiple client projects.",
        achievements: [
          "Reduced page load time by 30% through bundle optimization and lazy loading",
          "Built design system used across 15+ projects, improving development speed by 40%",
          "Mentored 3 junior developers who were promoted within 1 year"
        ],
        technologies: ["React", "JavaScript", "CSS3", "Webpack", "Jest"],
        companyLogo: null,
        employmentType: "Full-time"
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
        description: "Graduated with First Class with Distinction. Focused on advanced algorithms, distributed systems, and web technologies.",
        achievements: ["Gold Medalist", "President of Coding Club", "Hackathon Winner 2020"],
        grade: "8.9/10"
      }
    ],
    projects: [
      {
        id: 1,
        name: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with real-time inventory management, payment integration, and admin dashboard.",
        technologies: ["React", "Node.js", "MongoDB", "Stripe API", "Redis"],
        githubUrl: "https://github.com/krishnapatil/ecommerce-platform",
        liveUrl: "https://ecommerce-demo.krishna.com",
        startDate: "2023-01",
        endDate: "2023-04",
        featured: true,
        stars: 45,
        forks: 12,
        demoVideo: "https://youtube.com/watch?v=demo123"
      },
      {
        id: 2,
        name: "Task Management App",
        description: "Collaborative task management application with real-time updates, file sharing, and team collaboration features.",
        technologies: ["React", "Socket.io", "Express.js", "MongoDB", "JWT"],
        githubUrl: "https://github.com/krishnapatil/task-manager",
        liveUrl: "https://tasks.krishna.com",
        startDate: "2022-08",
        endDate: "2022-11",
        featured: true,
        stars: 32,
        forks: 8
      }
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        issueDate: "2023-03",
        expiryDate: "2026-03",
        credentialUrl: "https://aws.amazon.com/certification",
        badge: "aws-certified"
      },
      {
        id: 2,
        name: "React Developer Certification",
        issuer: "Meta",
        issueDate: "2022-08",
        expiryDate: null,
        credentialUrl: "https://coursera.org/verify/123456"
      }
    ],
    socialLinks: {
      linkedin: "krishna-patil-rajput",
      github: "krishnapatil",
      twitter: "krishnapatil",
      blog: "krishnablogy.blogspot.com",
      portfolio: "https://krishnapatil.dev"
    },
    languages: [
      { language: "English", proficiency: "Professional", level: 90 },
      { language: "Hindi", proficiency: "Native", level: 100 },
      { language: "Marathi", proficiency: "Native", level: 100 }
    ],
    followersCount: 456,
    followingCount: 234,
    connectionsCount: 389,
    joinedDate: "2021-06-15",
    lastActive: new Date().toISOString(),
    privacySettings: {
      profileVisibility: 'public',
      emailVisibility: 'connections',
      phoneVisibility: 'private',
      activityStatus: true
    },
    stats: {
      profileViews: 1567,
      postImpressions: 8923,
      searchAppearances: 567,
      articleViews: 2345,
      connectionGrowth: 12.5
    },
    availability: {
      status: "open",
      type: "full-time",
      location: "remote",
      startDate: "immediate"
    },
    interests: ["Open Source", "Machine Learning", "DevOps", "UI/UX Design", "Technical Writing"]
  };

  const atharvaData = {
    id: 2,
    firstName: "Atharva",
    lastName: "Patil Rajput",
    userName: "atharvapatil",
    profileImage: null,
    coverImage: null,
    headline: "Software Engineer & AI/ML Specialist",
    location: "Mumbai, Maharashtra, India",
    email: "atharva.patil@example.com",
    phone: "+91 98765 43211",
    website: "https://atharva-tech-blog.com",
    bio: "🚀 Software Engineer specializing in AI/ML and backend development. Passionate about building intelligent systems and scalable architectures. Open-source contributor with focus on machine learning applications and cloud-native solutions.",
    skills: [
      { id: 1, name: "Python", level: "expert", category: "backend", years: 3, endorsements: 25 },
      { id: 2, name: "Machine Learning", level: "advanced", category: "ai-ml", years: 3, endorsements: 22 },
      { id: 3, name: "TensorFlow", level: "advanced", category: "ai-ml", years: 2, endorsements: 18 },
      { id: 4, name: "PyTorch", level: "intermediate", category: "ai-ml", years: 1, endorsements: 12 },
      { id: 5, name: "Java", level: "advanced", category: "backend", years: 3, endorsements: 20 },
      { id: 6, name: "Spring Boot", level: "advanced", category: "backend", years: 2, endorsements: 16 },
      { id: 7, name: "SQL", level: "expert", category: "database", years: 3, endorsements: 19 },
      { id: 8, name: "Docker", level: "advanced", category: "devops", years: 2, endorsements: 15 },
      { id: 9, name: "Kubernetes", level: "intermediate", category: "devops", years: 1, endorsements: 10 },
      { id: 10, name: "AWS", level: "advanced", category: "cloud", years: 2, endorsements: 17 },
      { id: 11, name: "React", level: "intermediate", category: "frontend", years: 1, endorsements: 8 },
      { id: 12, name: "JavaScript", level: "intermediate", category: "frontend", years: 2, endorsements: 11 },
      { id: 13, name: "Git", level: "advanced", category: "tools", years: 3, endorsements: 14 },
      { id: 14, name: "REST APIs", level: "expert", category: "backend", years: 3, endorsements: 21 },
      { id: 15, name: "Microservices", level: "advanced", category: "architecture", years: 2, endorsements: 13 }
    ],
    experience: [
      {
        id: 1,
        title: "Software Engineer - AI/ML",
        company: "AI Innovations Ltd",
        location: "Mumbai, India",
        startDate: "2022-06",
        endDate: null,
        current: true,
        description: "Developing machine learning models and AI-powered applications for enterprise clients. Focus on natural language processing and computer vision solutions.",
        achievements: [
          "Built ML model that improved prediction accuracy by 35%",
          "Reduced model inference time by 60% through optimization",
          "Led deployment of AI system serving 50,000+ daily requests"
        ],
        technologies: ["Python", "TensorFlow", "Docker", "AWS", "Kubernetes"],
        companyLogo: null,
        employmentType: "Full-time"
      }
    ],
    education: [
      {
        id: 1,
        school: "IIT Bombay",
        degree: "Bachelor of Technology in Computer Science",
        field: "Computer Science & AI",
        startDate: "2017-07",
        endDate: "2021-05",
        current: false,
        description: "Specialized in Artificial Intelligence and Machine Learning. Completed thesis on 'Deep Learning for Natural Language Processing'.",
        achievements: ["Dean's List", "AI Research Assistant", "Hackathon Finalist"],
        grade: "8.5/10"
      }
    ],
    projects: [
      {
        id: 1,
        name: "Smart Chatbot Platform",
        description: "AI-powered chatbot platform with natural language understanding and multi-language support.",
        technologies: ["Python", "TensorFlow", "React", "FastAPI", "MongoDB"],
        githubUrl: "https://github.com/atharvapatil/chatbot-platform",
        liveUrl: "https://chatbot.atharva.com",
        startDate: "2023-03",
        endDate: "2023-07",
        featured: true,
        stars: 38,
        forks: 15
      }
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "2023-01",
        expiryDate: "2026-01",
        credentialUrl: "https://aws.amazon.com/certification"
      }
    ],
    socialLinks: {
      linkedin: "atharva-patil-rajput",
      github: "atharvapatil",
      twitter: "atharvatech",
      blog: "atharva-tech-blog.com",
      portfolio: "https://atharva.dev"
    },
    languages: [
      { language: "English", proficiency: "Professional", level: 95 },
      { language: "Hindi", proficiency: "Native", level: 100 },
      { language: "Marathi", proficiency: "Native", level: 100 }
    ],
    followersCount: 289,
    followingCount: 167,
    connectionsCount: 312,
    joinedDate: "2021-08-20",
    lastActive: new Date().toISOString(),
    privacySettings: {
      profileVisibility: 'public',
      emailVisibility: 'connections',
      phoneVisibility: 'private',
      activityStatus: true
    },
    stats: {
      profileViews: 987,
      postImpressions: 4567,
      searchAppearances: 234,
      articleViews: 1567,
      connectionGrowth: 8.2
    },
    availability: {
      status: "open",
      type: "full-time",
      location: "hybrid",
      startDate: "immediate"
    },
    interests: ["Artificial Intelligence", "Machine Learning", "Cloud Computing", "Data Science", "Open Source"]
  };

  // Determine which data to display
  const displayData = userData || (authData?.user?.email?.includes('atharva') ? atharvaData : krishnaData);

  // Enhanced skill categories
  const skillCategories = {
    frontend: { name: "Frontend", icon: <MdComputer className="w-5 h-5" />, color: "blue" },
    backend: { name: "Backend", icon: <FaServer className="w-5 h-5" />, color: "green" },
    database: { name: "Database", icon: <FaDatabase className="w-5 h-5" />, color: "purple" },
    cloud: { name: "Cloud & DevOps", icon: <FaCloud className="w-5 h-5" />, color: "orange" },
    tools: { name: "Tools", icon: <FaTools className="w-5 h-5" />, color: "gray" },
    testing: { name: "Testing", icon: <MdSpeed className="w-5 h-5" />, color: "red" },
    "ai-ml": { name: "AI/ML", icon: <FaRobot className="w-5 h-5" />, color: "pink" },
    architecture: { name: "Architecture", icon: <FaNetworkWired className="w-5 h-5" />, color: "indigo" }
  };

  // Enhanced tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <MdAnalytics />, count: null },
    { id: 'experience', label: 'Experience', icon: <MdWork />, count: displayData.experience?.length },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram />, count: displayData.projects?.length },
    { id: 'skills', label: 'Skills', icon: <FaCog />, count: displayData.skills?.length },
    { id: 'education', label: 'Education', icon: <MdSchool />, count: displayData.education?.length },
    { id: 'certifications', label: 'Certifications', icon: <FaCertificate />, count: displayData.certifications?.length },
    { id: 'analytics', label: 'Analytics', icon: <MdTrendingUp />, count: null }
  ];

  // Filter skills by category
  const filteredSkills = displayData.skills?.filter(skill =>
    activeSkillFilter === 'all' || skill.category === activeSkillFilter
  ) || [];

  // Enhanced skill icon mapping
  const getSkillIcon = (skillName) => {
    const iconMap = {
      'JavaScript': <SiJavascript className="text-yellow-500" />,
      'React': <SiReact className="text-blue-500" />,
      'Node.js': <SiNodedotjs className="text-green-600" />,
      'TypeScript': <SiTypescript className="text-blue-600" />,
      'Python': <SiPython className="text-blue-400" />,
      'MongoDB': <SiMongodb className="text-green-500" />,
      'PostgreSQL': <SiPostgresql className="text-blue-700" />,
      'Express.js': <SiExpress className="text-gray-600" />,
      'HTML5': <SiHtml5 className="text-orange-500" />,
      'CSS3': <SiCss3 className="text-blue-500" />,
      'Tailwind CSS': <SiTailwindcss className="text-cyan-500" />,
      'Git': <SiGit className="text-orange-600" />,
      'Docker': <SiDocker className="text-blue-400" />,
      'AWS': <SiAmazon className="text-orange-400" />,
      'Redis': <SiRedis className="text-red-600" />,
      'GraphQL': <SiGraphql className="text-pink-600" />,
      'Jest': <SiJest className="text-red-500" />,
      'Webpack': <SiWebpack className="text-blue-500" />,
      'Java': <FaCode className="text-red-500" />,
      'Spring Boot': <FaServer className="text-green-500" />,
      'Machine Learning': <FaRobot className="text-purple-500" />,
      'TensorFlow': <FaRobot className="text-orange-500" />,
      'PyTorch': <FaRobot className="text-red-500" />,
      'SQL': <FaDatabase className="text-blue-500" />,
      'Microservices': <FaNetworkWired className="text-indigo-500" />
    };

    return iconMap[skillName] || <FaTools className="text-gray-500" />;
  };

  // Get level color and progress
  const getLevelInfo = (level) => {
    const info = {
      beginner: { color: 'green', width: '40%', label: 'Beginner' },
      intermediate: { color: 'blue', width: '60%', label: 'Intermediate' },
      advanced: { color: 'purple', width: '80%', label: 'Advanced' },
      expert: { color: 'red', width: '100%', label: 'Expert' }
    };
    return info[level] || info.intermediate;
  };

  // Calculate profile strength
  const calculateProfileStrength = useCallback((data) => {
    let strength = 0;
    const maxPoints = 100;

    if (data.firstName && data.lastName) strength += 5;
    if (data.headline) strength += 5;
    if (data.bio && data.bio.length > 100) strength += 10;
    if (data.profileImage) strength += 5;
    if (data.coverImage) strength += 5;
    if (data.location) strength += 5;
    if (data.email) strength += 5;
    if (data.phone) strength += 5;
    if (data.skills && data.skills.length >= 8) strength += 15;
    if (data.experience && data.experience.length > 0) strength += 10;
    if (data.experience?.some(exp => exp.current)) strength += 5;
    if (data.education && data.education.length > 0) strength += 5;
    if (data.certifications && data.certifications.length > 0) strength += 5;
    if (data.projects && data.projects.length > 0) strength += 5;
    if (data.languages && data.languages.length > 0) strength += 5;
    if (data.socialLinks && Object.keys(data.socialLinks).length >= 3) strength += 5;

    return Math.min(strength, maxPoints);
  }, []);

  // Initialize achievements
  useEffect(() => {
    const newAchievements = [];
    const strength = calculateProfileStrength(displayData);

    if (strength >= 90) newAchievements.push({ name: "Profile Master", icon: <FaCrown />, color: "yellow" });
    if (strength >= 80) newAchievements.push({ name: "Elite Profile", icon: <FaGem />, color: "purple" });
    if (displayData.skills?.length >= 15) newAchievements.push({ name: "Skill Champion", icon: <FaTrophy />, color: "blue" });
    if (displayData.experience?.length >= 3) newAchievements.push({ name: "Experienced Pro", icon: <FaBriefcase />, color: "green" });
    if (displayData.projects?.length >= 5) newAchievements.push({ name: "Project Guru", icon: <FaProjectDiagram />, color: "orange" });
    if (displayData.certifications?.length >= 3) newAchievements.push({ name: "Certified Expert", icon: <FaCertificate />, color: "red" });
    if (displayData.stats?.profileViews >= 1000) newAchievements.push({ name: "Popular Profile", icon: <FaFire />, color: "pink" });

    setAchievements(newAchievements);
  }, [displayData, calculateProfileStrength]);

  // Simulate profile views
  useEffect(() => {
    const views = [
      { name: "Recruiter at Google", time: "2 hours ago", avatar: null },
      { name: "Hiring Manager at Microsoft", time: "5 hours ago", avatar: null },
      { name: "Tech Lead at Amazon", time: "1 day ago", avatar: null },
      { name: "Startup Founder", time: "2 days ago", avatar: null }
    ];
    setProfileViews(views);
  }, []);

  // Enhanced handlers
  const handleExportData = async () => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const dataStr = JSON.stringify(displayData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${displayData.firstName.toLowerCase()}-${displayData.lastName.toLowerCase()}-profile-data.json`;
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

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUserData(editForm);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully! ✅");
      setTimeout(() => setSuccessMessage(""), 5000);
      setHasUnsavedChanges(false);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
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
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUserData(null);
      if (setAuthData) {
        setAuthData({
          isAuthenticated: false,
          user: null,
          token: null
        });
      }
      navigate('/login');
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Initialize edit form when editing starts
  useEffect(() => {
    if (isEditing) {
      setEditForm({ ...displayData });
      setProfileStrength(calculateProfileStrength(displayData));
    }
  }, [isEditing, displayData, calculateProfileStrength]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Feed</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
              {['normal', 'compact', 'detailed'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${viewMode === mode
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAchievementsModal(true)}
              className="relative p-3 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all"
            >
              <FaTrophy className="w-5 h-5 text-yellow-500" />
              {achievements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {achievements.length}
                </span>
              )}
            </button>

            <button
              onClick={handleExportData}
              disabled={exportLoading}
              className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              <FaDownload className="w-4 h-4" />
              <span className="font-medium">{exportLoading ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>

        {/* Achievements Banner */}
        {achievements.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaTrophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Amazing Progress! 🎉</h3>
                  <p className="text-purple-100">
                    You've unlocked {achievements.length} achievements. Keep building your professional presence!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAchievementsModal(true)}
                className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold"
              >
                View All
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8 overflow-hidden">
          {/* Cover Photo */}
          <div className="relative h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            {displayData.coverImage && (
              <img
                src={displayData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover mix-blend-overlay opacity-20"
              />
            )}

            {/* Profile Image */}
            <div className="absolute -bottom-20 left-8">
              <div className="relative group">
                <div className="relative">
                  <img
                    src={displayData.profileImage || dp}
                    alt={`${displayData.firstName} ${displayData.lastName}`}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => setShowImageUpload({ ...showImageUpload, profile: true })}
                  >
                    <CiCamera className='w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                  </div>
                )}
              </div>
            </div>

            {/* Stats Overview Card */}
            <div className="absolute right-8 bottom-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl min-w-80">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <MdAnalytics className="w-5 h-5 text-blue-500" />
                <span>Profile Analytics</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-bold text-gray-900">{displayData.stats?.profileViews?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Post Impressions</span>
                  <span className="font-bold text-gray-900">{displayData.stats?.postImpressions?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Search Appearances</span>
                  <span className="font-bold text-gray-900">{displayData.stats?.searchAppearances?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="px-8 pb-8 pt-24">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-5xl font-bold text-gray-900">
                    {displayData.firstName} {displayData.lastName}
                  </h1>
                  <div className="flex space-x-2">
                    <MdVerified className="w-7 h-7 text-blue-500" />
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <FaBolt className="w-3 h-3" />
                      <span>Pro Member</span>
                    </div>
                  </div>
                </div>

                <p className="text-2xl text-gray-600 mb-4">{displayData.headline}</p>

                <div className="flex items-center space-x-6 text-gray-500 mb-6">
                  <span className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="w-5 h-5" />
                    <span className="font-medium">{displayData.location}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <FaUserPlus className="w-5 h-5" />
                    <span>{displayData.connectionsCount}+ connections</span>
                  </span>
                  {isOnline && (
                    <span className="flex items-center space-x-2 text-green-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Online</span>
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mb-6">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold shadow-2xl flex items-center space-x-3 transform hover:scale-105 hover:shadow-2xl"
                    >
                      <MdEdit className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg flex items-center space-x-3 disabled:opacity-50"
                      >
                        <MdSave className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center space-x-3"
                      >
                        <MdCancel className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Success and Error Messages */}
                {successMessage && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                    <FaCheck className="w-5 h-5 text-green-500" />
                    <p className="text-green-700 font-medium">{successMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                    <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {/* Stats Bar */}
                <div className="flex space-x-12 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => setShowConnections(true)}
                    className="text-center hover:scale-105 transition-transform group"
                  >
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {displayData.followersCount || 0}
                    </div>
                    <div className="text-gray-600 text-sm group-hover:text-blue-500 transition-colors">Followers</div>
                  </button>

                  <button
                    onClick={() => setShowConnections(true)}
                    className="text-center hover:scale-105 transition-transform group"
                  >
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {displayData.followingCount || 0}
                    </div>
                    <div className="text-gray-600 text-sm group-hover:text-blue-500 transition-colors">Following</div>
                  </button>

                  <button
                    onClick={() => setShowConnections(true)}
                    className="text-center hover:scale-105 transition-transform group"
                  >
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {displayData.connectionsCount || 0}
                    </div>
                    <div className="text-gray-600 text-sm group-hover:text-blue-500 transition-colors">Connections</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 sticky top-4 z-20">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-1 px-6 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-5 px-6 border-b-2 font-semibold text-sm flex items-center space-x-3 transition-all whitespace-nowrap ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        } rounded-t-xl min-w-0`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="xl:col-span-3 space-y-8">
                      {/* Bio Section */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
                          <FaUserPlus className="w-6 h-6 text-blue-500" />
                          <span>Professional Summary</span>
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{displayData.bio}</p>
                      </div>

                      {/* Featured Skills Grid */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-8">
                        <div className="flex justify-between items-center mb-8">
                          <h3 className="text-2xl font-bold text-gray-900">Top Skills</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setActiveSkillFilter('all')}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeSkillFilter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              All
                            </button>
                            {Object.entries(skillCategories).map(([key, category]) => (
                              <button
                                key={key}
                                onClick={() => setActiveSkillFilter(key)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeSkillFilter === key
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredSkills.slice(0, 9).map((skill) => {
                            const levelInfo = getLevelInfo(skill.level);
                            return (
                              <div key={skill.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    {getSkillIcon(skill.name)}
                                    <span className="font-bold text-gray-900">{skill.name}</span>
                                  </div>
                                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${levelInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                                    levelInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                      levelInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {levelInfo.label}
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                      className={`h-3 rounded-full transition-all duration-1000 ${levelInfo.color === 'red' ? 'bg-red-500' :
                                        levelInfo.color === 'purple' ? 'bg-purple-500' :
                                          levelInfo.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                                        }`}
                                      style={{ width: levelInfo.width }}
                                    ></div>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <span>{skill.years} year{skill.years > 1 ? 's' : ''}</span>
                                    <span>{skill.endorsements} endorsements</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                      {/* Profile Completion */}
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                        <h3 className="font-bold mb-4 text-lg">Profile Strength</h3>
                        <div className="text-center mb-4">
                          <div className="text-4xl font-bold">{profileStrength}%</div>
                          <div className="text-purple-100">Complete</div>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                          <div
                            className="h-3 rounded-full bg-white transition-all duration-1000"
                            style={{ width: `${profileStrength}%` }}
                          ></div>
                        </div>
                        <p className="text-purple-100 text-sm text-center">
                          {profileStrength >= 90 ? 'Excellent! Your profile stands out' :
                            profileStrength >= 70 ? 'Great job! Almost there' :
                              'Keep adding details to improve visibility'}
                        </p>
                      </div>

                      {/* Recent Profile Views */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <FaEye className="w-5 h-5 text-blue-500" />
                          <span>Recent Profile Views</span>
                        </h3>
                        <div className="space-y-3">
                          {profileViews.slice(0, 3).map((view, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {view.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{view.name}</p>
                                <p className="text-sm text-gray-500">{view.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">Technical Skills</h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setActiveSkillFilter('all')}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeSkillFilter === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          All Skills
                        </button>
                        {Object.entries(skillCategories).map(([key, category]) => (
                          <button
                            key={key}
                            onClick={() => setActiveSkillFilter(key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${activeSkillFilter === key
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                          >
                            {category.icon}
                            <span>{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredSkills.map((skill) => {
                        const levelInfo = getLevelInfo(skill.level);
                        return (
                          <div key={skill.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all group">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                {getSkillIcon(skill.name)}
                                <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {skill.name}
                                </span>
                              </div>
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${levelInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                                levelInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                  levelInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                {levelInfo.label}
                              </span>
                            </div>
                            <div className="space-y-3">
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full transition-all duration-1000 ${levelInfo.color === 'red' ? 'bg-red-500' :
                                    levelInfo.color === 'purple' ? 'bg-purple-500' :
                                      levelInfo.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                                    }`}
                                  style={{ width: levelInfo.width }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm text-gray-500">
                                <span>{skill.years} year{skill.years > 1 ? 's' : ''} experience</span>
                                <span>{skill.endorsements} endorsements</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Work Experience</h2>
                    <div className="space-y-6">
                      {displayData.experience?.map((exp) => (
                        <div key={exp.id} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{exp.title}</h3>
                              <p className="text-xl text-gray-600">{exp.company} • {exp.location}</p>
                              <p className="text-gray-500">
                                {new Date(exp.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} -
                                {exp.current ? ' Present' : ` ${new Date(exp.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`}
                              </p>
                            </div>
                            {exp.current && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-4">{exp.description}</p>

                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {exp.achievements.map((achievement, idx) => (
                                  <li key={idx}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map((tech, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Projects</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {displayData.projects?.map(project => (
                        <div key={project.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                              {project.featured && <FaStar className="w-5 h-5 text-yellow-500" />}
                            </div>
                            <p className="text-gray-600 mb-4">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.map((tech, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {tech}
                                </span>
                              ))}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex space-x-4">
                                {project.githubUrl && (
                                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                                    <FaGithub className="w-4 h-4" />
                                    <span>Code</span>
                                  </a>
                                )}
                                {project.liveUrl && (
                                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                                    <FaRocket className="w-4 h-4" />
                                    <span>Live Demo</span>
                                  </a>
                                )}
                              </div>
                              <div className="flex space-x-4 text-sm text-gray-500">
                                {project.stars && (
                                  <span className="flex items-center space-x-1">
                                    <FaStar className="w-4 h-4 text-yellow-500" />
                                    <span>{project.stars}</span>
                                  </span>
                                )}
                                {project.forks && (
                                  <span className="flex items-center space-x-1">
                                    <FaCode className="w-4 h-4 text-gray-500" />
                                    <span>{project.forks}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Achievements Modal */}
        {showAchievementsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-8 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-900">Your Achievements</h2>
                  <button
                    onClick={() => setShowAchievementsModal(false)}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <GiSplitCross className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-xl ${achievement.color === 'yellow' ? 'bg-yellow-500' :
                          achievement.color === 'purple' ? 'bg-purple-500' :
                            achievement.color === 'blue' ? 'bg-blue-500' :
                              achievement.color === 'green' ? 'bg-green-500' :
                                achievement.color === 'orange' ? 'bg-orange-500' :
                                  achievement.color === 'red' ? 'bg-red-500' : 'bg-pink-500'
                          } text-white`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{achievement.name}</h3>
                          <p className="text-gray-600">Unlocked for outstanding profile completion</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Logout Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CiLogout className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Logout Confirmation</h3>
                <p className="text-gray-600 mb-8 text-lg">Are you sure you want to logout? You'll need to sign in again to access your account.</p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold text-lg shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Followers/Following Modal */}
        {showConnections && (
          <FollowersFollowing
            edit={showConnections}
            setEdit={setShowConnections}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;