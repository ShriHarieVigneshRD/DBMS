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
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <Navbar />
      <main className="pt-21 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="flex flex-col items-start space-y-0 border-r pr-8">
        




            {/* Rectangular Image Placeholder */}
            <div className="w-full h-100 bg-gray-300 mt-1 flex items-center justify-center text-gray-500 text-sm rounded-md shadow-inner">
              <img src={pictureProfile} alt="Profile" className="w-full h-full object-cover rounded-md" />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-center space-y-2">
            {/* Username Update */}
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 text-left">Profile</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-black-700 text-base-2xl font-bond">
              <p><span className="font-semibold">Email:</span> {profile.email}</p>
              <p><span className="font-semibold">Username:</span> {profile.username}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">New Username</label>
              <input
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="border w-full rounded px-4 py-2"
              />
              <button
                onClick={handleUsernameUpdate}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Username
              </button>
            </div>

            {/* Password Update */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border w-full rounded px-4 py-2 mb-2"
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border w-full rounded px-4 py-2"
              />
              <button
                onClick={handlePasswordUpdate}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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