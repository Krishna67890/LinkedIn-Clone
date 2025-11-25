import React, { useContext, useState } from 'react'
import logo2 from '../assets/logo2.png'
import { FaSearch, FaHome, FaUser, FaBell, FaSignOutAlt, FaUsers, FaBriefcase, FaEnvelope } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import dp from "../assets/dp.webp"
//import { useUserData } from '../context/userContext';
import { useAuth } from '../context/AuthContext'; // ✅ Fixed import path
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false)
  let { userData, setUserData } = useUserData()
  let [showPopup, setShowPopup] = useState(false)
  let navigate = useNavigate()
  let location = useLocation()

  // ✅ Use useAuth hook instead of authDataContext
  const { authData, setAuthData, serverUrl, demoLogout } = useAuth()

  const handleSignOut = async () => {
    try {
      // Try to call backend logout
      try {
        await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      } catch (error) {
        console.log("Backend logout failed, proceeding with frontend logout");
      }

      // Clear frontend state using demoLogout from auth context
      demoLogout(); // ✅ Use the demoLogout function from auth context
      setUserData(null)

      setShowPopup(false)
      navigate("/login")
    } catch (error) {
      console.log("Logout error:", error);
      // Force logout even if there's an error
      localStorage.clear()
      navigate("/login")
    }
  }

  const isActivePath = (path) => {
    return location.pathname === path;
  }

  const isActivePathStartsWith = (path) => {
    return location.pathname.startsWith(path);
  }

  // Close popup when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && !event.target.closest('.user-popup') && !event.target.closest('.profile-avatar')) {
        setShowPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPopup])

  return (
    <div className='w-full h-[80px] bg-white fixed top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]'>
      {/* Left Section - Logo and Search */}
      <div className='flex justify-center items-center gap-[10px]'>
        <Link to="/" onClick={() => setActiveSearch(false)}>
          <img src={logo2} alt="Logo" className='w-[50px] cursor-pointer' />
        </Link>

        {!activeSearch && (
          <div className='lg:hidden'>
            <FaSearch
              className='w-[23px] h-[23px] text-gray-600 cursor-pointer'
              onClick={() => setActiveSearch(true)}
            />
          </div>
        )}

        <form className={`w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7] flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${activeSearch ? "flex" : "hidden lg:flex"}`}>
          <FaSearch className='w-[23px] h-[23px] text-gray-600' />
          <input
            type="text"
            className='w-[80%] h-full bg-transparent outline-none border-0'
            placeholder='Search users, jobs, posts...'
          />
        </form>
      </div>

      {/* Right Section - Navigation Icons */}
      <div className='flex justify-center items-center gap-[20px] relative'>
        {/* User Popup */}
        {showPopup && (
          <div className='user-popup w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] right-0 rounded-lg flex flex-col items-center p-[20px] gap-[20px] z-50 border border-gray-200'>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-blue-500'>
              <img src={userData?.profileImage || dp} alt="Profile" className='w-full h-full object-cover' />
            </div>
            <div className='text-center'>
              <div className='text-[19px] font-semibold text-gray-800'>
                {userData ? `${userData.firstName} ${userData.lastName}` : 'Guest User'}
              </div>
              <div className='text-sm text-gray-600 mt-1'>
                {userData?.headline || 'Update your profile'}
              </div>
            </div>

            <Link
              to="/profile"
              className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center font-medium hover:bg-blue-50 transition-colors'
              onClick={() => setShowPopup(false)}
            >
              View Profile
            </Link>

            <div className='w-full h-[1px] bg-gray-200'></div>

            {/* Quick Links in Popup */}
            <div className='w-full space-y-3'>
              <Link
                to="/jobs"
                className='flex w-full items-center justify-start text-gray-600 gap-[10px] hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-50'
                onClick={() => setShowPopup(false)}
              >
                <FaBriefcase className='w-[20px] h-[20px]' />
                <div>Jobs</div>
              </Link>

              <Link
                to="/network"
                className='flex w-full items-center justify-start text-gray-600 gap-[10px] hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-50'
                onClick={() => setShowPopup(false)}
              >
                <FaUsers className='w-[20px] h-[20px]' />
                <div>My Network</div>
              </Link>

              <Link
                to="/messages"
                className='flex w-full items-center justify-start text-gray-600 gap-[10px] hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-50'
                onClick={() => setShowPopup(false)}
              >
                <FaEnvelope className='w-[20px] h-[20px]' />
                <div>Messages</div>
              </Link>

              <Link
                to="/notifications"
                className='flex w-full items-center justify-start text-gray-600 gap-[10px] hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-50'
                onClick={() => setShowPopup(false)}
              >
                <FaBell className='w-[20px] h-[20px]' />
                <div>Notifications</div>
              </Link>
            </div>

            <div className='w-full h-[1px] bg-gray-200'></div>

            <button
              className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545] flex items-center justify-center gap-2 font-medium hover:bg-red-50 transition-colors'
              onClick={handleSignOut}
            >
              <FaSignOutAlt className='w-4 h-4' />
              Sign Out
            </button>
          </div>
        )}

        {/* Navigation Items */}
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center transition-colors p-2 rounded-lg min-w-[60px] ${isActivePath('/') ? 'text-black font-semibold border-b-2 border-blue-500' : 'text-gray-600 hover:text-black'
            }`}
        >
          <FaHome className='w-[23px] h-[23px]' />
          <div className='hidden md:block text-xs mt-1'>Home</div>
        </Link>

        {/* My Network */}
        <Link
          to="/network"
          className={`flex flex-col items-center justify-center transition-colors p-2 rounded-lg min-w-[60px] ${isActivePathStartsWith('/network') ? 'text-black font-semibold border-b-2 border-blue-500' : 'text-gray-600 hover:text-black'
            }`}
        >
          <FaUsers className='w-[23px] h-[23px]' />
          <div className='hidden md:block text-xs mt-1'>Network</div>
        </Link>

        {/* Jobs */}
        <Link
          to="/jobs"
          className={`flex flex-col items-center justify-center transition-colors p-2 rounded-lg min-w-[60px] ${isActivePathStartsWith('/jobs') ? 'text-black font-semibold border-b-2 border-blue-500' : 'text-gray-600 hover:text-black'
            }`}
        >
          <FaBriefcase className='w-[23px] h-[23px]' />
          <div className='hidden md:block text-xs mt-1'>Jobs</div>
        </Link>

        {/* Messages */}
        <Link
          to="/messages"
          className={`flex flex-col items-center justify-center transition-colors p-2 rounded-lg min-w-[60px] ${isActivePathStartsWith('/messages') ? 'text-black font-semibold border-b-2 border-blue-500' : 'text-gray-600 hover:text-black'
            }`}
        >
          <FaEnvelope className='w-[23px] h-[23px]' />
          <div className='hidden md:block text-xs mt-1'>Messages</div>
        </Link>

        {/* Notifications */}
        <Link
          to="/notifications"
          className={`flex flex-col items-center justify-center transition-colors p-2 rounded-lg min-w-[60px] relative ${isActivePath('/notifications') ? 'text-black font-semibold border-b-2 border-blue-500' : 'text-gray-600 hover:text-black'
            }`}
        >
          <IoNotifications className='w-[23px] h-[23px]' />
          <div className='hidden md:block text-xs mt-1'>Notifications</div>
          {/* Notification Badge */}
          <div className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center'>
            3
          </div>
        </Link>

        {/* Profile Avatar with Dropdown */}
        <div className='relative profile-avatar'>
          <div
            className={`w-[45px] h-[45px] rounded-full overflow-hidden cursor-pointer border-2 transition-colors ${showPopup || isActivePathStartsWith('/profile') ? 'border-blue-500' : 'border-transparent hover:border-blue-500'
              }`}
            onClick={() => setShowPopup(prev => !prev)}
          >
            <img
              src={userData?.profileImage || dp}
              alt="Profile"
              className='w-full h-full object-cover'
            />
          </div>

          {/* Active indicator for profile */}
          {isActivePathStartsWith('/profile') && (
            <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full'></div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {activeSearch && (
        <div className='fixed inset-0 bg-white z-50 lg:hidden'>
          <div className='p-4 flex items-center gap-4 border-b border-gray-200'>
            <button
              onClick={() => setActiveSearch(false)}
              className='text-gray-600 p-2'
            >
              ← Back
            </button>
            <form className='flex-1 flex items-center gap-[10px] bg-[#f0efe7] px-[10px] py-[5px] rounded-md'>
              <FaSearch className='w-[23px] h-[23px] text-gray-600' />
              <input
                type="text"
                className='w-[80%] h-full bg-transparent outline-none border-0'
                placeholder='Search users, jobs, posts...'
                autoFocus
              />
            </form>
          </div>

          {/* Recent Searches */}
          <div className='p-4'>
            <h3 className='font-semibold text-gray-700 mb-3'>Recent Searches</h3>
            <div className='space-y-2'>
              <div className='p-2 hover:bg-gray-100 rounded cursor-pointer'>Software Engineer</div>
              <div className='p-2 hover:bg-gray-100 rounded cursor-pointer'>React Developer</div>
              <div className='p-2 hover:bg-gray-100 rounded cursor-pointer'>Project Manager</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='p-4 border-t border-gray-200'>
            <h3 className='font-semibold text-gray-700 mb-3'>Quick Actions</h3>
            <div className='grid grid-cols-2 gap-2'>
              <Link
                to="/jobs"
                className='p-3 bg-blue-50 text-blue-600 rounded-lg text-center hover:bg-blue-100 transition-colors'
                onClick={() => setActiveSearch(false)}
              >
                Find Jobs
              </Link>
              <Link
                to="/network"
                className='p-3 bg-green-50 text-green-600 rounded-lg text-center hover:bg-green-100 transition-colors'
                onClick={() => setActiveSearch(false)}
              >
                My Network
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for popup */}
      {showPopup && (
        <div
          className='fixed inset-0 bg-black bg-opacity-10 z-40 lg:hidden'
          onClick={() => setShowPopup(false)}
        ></div>
      )}
    </div>
  )
}

export default Nav
