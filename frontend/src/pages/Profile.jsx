import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import pictureProfile from '../assets/profile.png';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [userId, setUserId] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const storedId = localStorage.getItem('userId');
      if (!token || !storedId) {
        navigate('/login');
        return;
      }
      setUserId(storedId);

      const res = await axios.post('https://stock-backend-production-1815.up.railway.app/user/profile', { user_id: storedId });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      const res = await axios.put('https://stock-backend-production-1815.up.railway.app/user/update-username', {
        user_id: userId,
        newUsername,
      });
      toast.success(res.data.message);
      fetchProfile();
      setNewUsername('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating username');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const res = await axios.put('https://stock-backend-production-1815.up.railway.app/user/update-password', {
        user_id: userId,
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating password');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <ToastContainer />
      <Navbar />
      <main className="pt-20 px-4">
  <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-4 grid grid-cols-1 md:grid-cols-10 gap-4 items-stretch h-[635px]">
    
    {/* Left Side: Image */}
    <div className="col-span-3 h-full">
      <img
        src={pictureProfile}
        alt="Profile"
        className="h-full w-full object-cover rounded-md shadow"
      />
    </div>

    {/* Right Side: Profile Details and Forms */}
    <div className="col-span-7 flex flex-col justify-start gap-3 h-full">
      {/* Profile Info */}
      {/* Profile Info */}
      <h2 className="text-4xl font-bold text-gray-800">Profile</h2>

        <div className="bg-gray-100 border border-gray-100 shadow-sm p-2 rounded-lg">
          <p className="text-lg text-gray-700 mb-2 font-semibold">
            Email:{' '}
            <span className="text-xl text-gray-900 font-extrabold">
              {profile?.email || <span className="italic text-gray-500">Loading...</span>}
            </span>
          </p>
          <p className="text-lg text-gray-700 font-semibold">
            Username:{' '}
            <span className="text-xl text-gray-900 font-extrabold">
              {profile?.username || <span className="italic text-gray-500">Loading...</span>}
            </span>
          </p>
        </div>

      {/* Update Username */}
      <div className="bg-gray-100 p-2 rounded-md">
        <label className="text-sm font-bold text-gray-700">New Username</label>
        <input
          type="text"
          placeholder="Enter new username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="border w-full rounded px-3 py-1 mt-1 mb-2"
        />
        <button
          onClick={handleUsernameUpdate}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-bold"
        >
          Update Username
        </button>
      </div>

      {/* Update Password */}
      <div className="bg-gray-100 p-2 rounded-md">
        <label className="text-sm font-bold text-gray-700">Current Password</label>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border w-full rounded px-3 py-1 mt-1 mb-2"
        />
        <label className="text-sm font-bold text-gray-700">New Password</label>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border w-full rounded px-3 py-1 mt-1"
        />
        <button
          onClick={handlePasswordUpdate}
          className="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 text-bold"
        >
          Update Password
        </button>
      </div>
    </div>
  </div>
</main>


    </div>
  );
};

export default Profile;
