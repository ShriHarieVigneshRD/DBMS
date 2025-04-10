import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

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

      const res = await axios.post('http://localhost:3000/user/profile', { user_id: storedId });

      setProfile(res.data);
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  const handleUsernameUpdate = async () => {
    try {
      const res = await axios.put('http://localhost:3000/user/update-username', {
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
      const res = await axios.put('http://localhost:3000/user/update-password', {
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

  const handleAccountDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;

    try {
      const res = await axios.delete('http://localhost:3000/user/delete-account', {
        data: { user_id: userId },
      });
      toast.success(res.data.message);
      localStorage.clear();
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting account');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      <Navbar />
      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Your Profile</h1>
          <p className="text-lg text-gray-600 mb-10">Welcome back, {profile.username}!</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Email: {profile.email}</h2>
            <h2 className="text-xl font-semibold mb-2">Username: {profile.username}</h2>
          </div>

          {/* Update Username */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border rounded px-4 py-2 mr-2"
            />
            <button
              onClick={handleUsernameUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Username
            </button>
          </div>

          {/* Update Password */}
          <div className="mb-8">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border rounded px-4 py-2 mr-2"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded px-4 py-2 mr-2"
            />
            <button
              onClick={handlePasswordUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update Password
            </button>
          </div>

          {/* Delete Account */}
          <div className="mb-8">
            <button
              onClick={handleAccountDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
