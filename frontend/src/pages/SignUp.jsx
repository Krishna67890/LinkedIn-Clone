// pages/SignUp.jsx
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/authContext';

function SignUp() {
  const [show, setShow] = useState(false);
  const { demoLogin } = useAuth();
//  const { setUserData } = useContext(UserContext); // ✅ Fixed - use UserContext instead of userDataContext
  // const { setUserData } = useContext(UserContext); // ✅ Fixed - use UserContext instead of userDataContext
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: ""
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccess("");
    
    try {
      console.log('🔄 Creating demo account...', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create user object for demo
      const newUser = {
        ...formData,
        headline: "New Member at LinkedIn Clone",
        location: "India",
        profileImage: null,
        skills: ["Welcome!"],
        followersCount: 0,
        followingCount: 0,
        connectionsCount: 0,
        joinedDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      // Remove password from stored user object
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Remove setUserData call since we don't have UserContext
      demoLogin(userWithoutPassword);
      setSuccess("Account created successfully! Redirecting...");
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
      
    } catch (error) {
      console.error('❌ Signup error:', error);
      setErr("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quick signup with demo data
  const quickSignup = (userType) => {
    setLoading(true);
    setErr("");
    setSuccess("");
    
    let demoData;
    
    if (userType === 'krishna') {
      demoData = {
        firstName: "Krishna",
        lastName: "Patil Rajput",
        email: `krishna${Date.now()}@demo.com`,
        userName: `krishnapatil${Date.now()}`,
        password: "demo123",
        headline: "Full Stack Developer & Tech Enthusiast",
        location: "Pune, Maharashtra, India",
        profileImage: null,
        skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
        followersCount: 324,
        followingCount: 156,
        connectionsCount: 287,
        joinedDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
    } else {
      demoData = {
        firstName: "Atharva", 
        lastName: "Patil Rajput",
        email: `atharva${Date.now()}@demo.com`,
        userName: `atharvapatil${Date.now()}`,
        password: "demo123",
        headline: "Software Engineer & Open Source Contributor",
        location: "Mumbai, Maharashtra, India", 
        profileImage: null,
        skills: ["Java", "Spring Boot", "AWS", "Docker", "Kubernetes"],
        followersCount: 189,
        followingCount: 234,
        connectionsCount: 156,
        joinedDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
    }
    
    // Fill the form with demo data
    setFormData(demoData);
    
    // Auto-submit after a delay
    setTimeout(() => {
      const submitEvent = new Event('submit', { cancelable: true });
      document.querySelector('form').dispatchEvent(submitEvent);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Header */}
      <header className="bg-white py-3 border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-[#0a66c2] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-lg">in</span>
              </div>
              <span className="text-2xl font-semibold text-gray-800" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                LinkedIn
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="max-w-[400px] w-full">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Make the most of your professional life
            </h1>
          </div>

          {/* Quick Signup Section */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-800 mb-2 text-center">Quick Demo Signup</h3>
            <div className="flex gap-2">
              <button
                onClick={() => quickSignup('krishna')}
                disabled={loading}
                className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                Krishna Patil Rajput
              </button>
              <button
                onClick={() => quickSignup('atharva')}
                disabled={loading}
                className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                Atharva Patil Rajput
              </button>
            </div>
            <p className="text-xs text-green-600 mt-2 text-center">
              Auto-fills form and creates demo account
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
            <form className="space-y-4" onSubmit={handleSignUp}>
              {/* First Name */}
              <div>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-gray-400 transition-colors text-sm"
                  placeholder="First Name"
                />
              </div>

              {/* Last Name */}
              <div>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-gray-400 transition-colors text-sm"
                  placeholder="Last Name"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-gray-400 transition-colors text-sm"
                  placeholder="Email"
                />
              </div>

              {/* Username */}
              <div>
                <input
                  type="text"
                  name="userName"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-gray-400 transition-colors text-sm"
                  placeholder="Username"
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-gray-400 transition-colors text-sm pr-12"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Agreement Text */}
              <div className="text-xs text-gray-600 text-center">
                By clicking Agree & Join, you agree to our demo version{' '}
                <button type="button" className="text-[#0a66c2] hover:underline">Terms</button>
                {' '}and{' '}
                <button type="button" className="text-[#0a66c2] hover:underline">Privacy Policy</button>.
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-700 text-sm text-center">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {err && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 text-sm text-center">{err}</p>
                </div>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a66c2] text-white py-3 px-4 rounded-full font-semibold hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Agree & Join"
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="mt-6 pt-6 border-t border-gray-300">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already on LinkedIn?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[#0a66c2] hover:text-[#004182] hover:underline font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8 space-y-4">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
              <button className="hover:text-[#0a66c2] hover:underline transition-colors">User Agreement</button>
              <button className="hover:text-[#0a66c2] hover:underline transition-colors">Privacy Policy</button>
              <button className="hover:text-[#0a66c2] hover:underline transition-colors">Cookie Policy</button>
            </div>
            <p className="text-xs text-gray-500">LinkedIn Clone © 2025 • Built by Krishna Patil Rajput</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignUp;
