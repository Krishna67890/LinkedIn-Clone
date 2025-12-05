// pages/Login.jsx - Fix the import path
import React, { useContext, useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useUserData } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [show, setShow] = useState(false);
<<<<<<< HEAD
  const { userData, setUserData } = useUserData();
  const { demoLogin } = useAuth(); // Get demoLogin from useAuth hook
=======
<<<<<<< HEAD
  const { userData, setUserData } = useUserData(); 
  const { demoLogin } = useAuth();
=======
  const { userData, setUserData } = useUserData();
  const { demoLogin } = useAuth(); // Get demoLogin from useAuth hook
>>>>>>> 4df3f66 (Updated LinkedIn clone: added News page and modified components)
>>>>>>> b4827ad05637f1472486f5c55a85e7eb1221d5c3
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Demo users data
  const demoUsers = [
    {
      firstName: "Krishna",
      lastName: "Patil Rajput",
      email: "krishna@demo.com",
      userName: "krishnapatil",
      password: "demo123",
      headline: "Senior Full Stack Developer & Tech Evangelist",
      location: "Pune, Maharashtra, India",
      profileImage: null,
      skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "AWS", "Docker"],
      followersCount: 456,
      followingCount: 234,
      connectionsCount: 389,
      joinedDate: "2021-06-15",
      lastActive: new Date().toISOString()
    },
    {
      firstName: "Atharva",
      lastName: "Patil Rajput",
      email: "atharva@demo.com",
      userName: "atharvapatil",
      password: "demo123",
      headline: "Software Engineer & AI/ML Specialist",
      location: "Mumbai, Maharashtra, India",
      profileImage: null,
      skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Java", "Spring Boot"],
      followersCount: 289,
      followingCount: 167,
      connectionsCount: 312,
      joinedDate: "2021-08-20",
      lastActive: new Date().toISOString()
    },
    {
      firstName: "Ankush",
      lastName: "Khakale",
      email: "ankush@demo.com",
      userName: "ankushkhakale",
      password: "demo123",
      headline: "Frontend Developer & UI/UX Designer",
      location: "Bangalore, Karnataka, India",
      profileImage: null,
      skills: ["JavaScript", "React", "Vue.js", "CSS", "Tailwind CSS", "Figma", "Adobe XD"],
      followersCount: 324,
      followingCount: 187,
      connectionsCount: 265,
      joinedDate: "2021-09-15",
      lastActive: new Date().toISOString()
    },
    {
      firstName: "Mahesh",
      lastName: "Vispute",
      email: "mahesh@demo.com",
      userName: "maheshvispute",
      password: "demo123",
      headline: "Backend Engineer & Database Specialist",
      location: "Hyderabad, Telangana, India",
      profileImage: null,
      skills: ["Java", "Spring Boot", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Kafka"],
      followersCount: 215,
      followingCount: 178,
      connectionsCount: 196,
      joinedDate: "2022-03-10",
      lastActive: new Date().toISOString()
    }
  ];

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      console.log('🔄 Attempting login...', { email });

      // Demo mode login
      const user = demoUsers.find(u => u.email === email && u.password === password);
      if (user) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = user;

        demoLogin(userWithoutPassword);
        setUserData(userWithoutPassword);

        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        setErr("Invalid email or password. Try 'krishna@demo.com' or 'atharva@demo.com' with password 'demo123'");
      }

    } catch (error) {
      console.error('❌ Login error:', error);
      setErr("Login failed. Please try the demo buttons below.");
    } finally {
      setLoading(false);
    }
  };

  // Quick login with demo users
  const quickLogin = (userIndex) => {
    setLoading(true);
    setErr("");

    const user = demoUsers[userIndex];
    setEmail(user.email);
    setPassword(user.password);

    // Auto-login after a short delay
    setTimeout(() => {
      const { password: _, ...userWithoutPassword } = user;

      demoLogin(userWithoutPassword);
      setUserData(userWithoutPassword);

      setTimeout(() => {
        navigate("/");
      }, 500);
    }, 1000);
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
              Sign in
            </h1>
            <p className="text-gray-600 text-sm">Stay updated on your professional world</p>
          </div>

          {/* Demo Users Section */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2 text-center">Quick Demo Login</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => quickLogin(0)}
                disabled={loading}
                className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in as Krishna...</span>
                  </div>
                ) : (
                  <>
                    <span>👨‍💻 Krishna Patil Rajput</span>
                  </>
                )}
              </button>
              <button
                onClick={() => quickLogin(1)}
                disabled={loading}
                className="w-full bg-green-100 text-green-700 py-3 px-4 rounded text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in as Atharva...</span>
                  </div>
                ) : (
                  <>
                    <span>👨‍💻 Atharva Patil Rajput</span>
                  </>
                )}
              </button>
              <button
                onClick={() => quickLogin(2)}
                disabled={loading}
                className="w-full bg-yellow-100 text-yellow-700 py-3 px-4 rounded text-sm font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-yellow-700 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in as Ankush...</span>
                  </div>
                ) : (
                  <>
                    <span>👨‍🎨 Ankush Khakale</span>
                  </>
                )}
              </button>
              <button
                onClick={() => quickLogin(3)}
                disabled={loading}
                className="w-full bg-purple-100 text-purple-700 py-3 px-4 rounded text-sm font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in as Mahesh...</span>
                  </div>
                ) : (
                  <>
                    <span>👨‍💻 Mahesh Vispute</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2 text-center">
              Password: demo123 (Auto-filled)
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
            <form className="space-y-4" onSubmit={handleSignIn}>
              {/* Email */}
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a66c2] focus:border-[#0a66c2] hover:border-gray-400 transition-colors text-sm"
                  placeholder="Email or Phone"
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Demo Credentials Hint */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="text-xs text-gray-600 text-center">
                  <strong>Demo Credentials:</strong><br />
                  krishna@demo.com / atharva@demo.com / ankush@demo.com / mahesh@demo.com<br />
                  Password: demo123
                </p>
              </div>

              {/* Error Message */}
              {err && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 text-sm text-center">{err}</p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a66c2] text-white py-3 px-4 rounded-full font-semibold hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="mt-6 pt-6 border-t border-gray-300">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  New to LinkedIn?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-[#0a66c2] hover:text-[#004182] hover:underline font-semibold transition-colors"
                  >
                    Join now
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

export default Login;
