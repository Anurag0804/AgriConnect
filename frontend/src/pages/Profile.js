import { useState, useEffect } from 'react';
import { getUser, updateUser } from '../services/userService';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    phone: '',
    gender: '',
    address: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      setError("You must be logged in to view this page.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUser(currentUser.userId);
        setProfile({
          username: data.username || '',
          phone: data.phone || '',
          gender: data.gender || '',
          address: data.address || '',
          profilePicture: data.profilePicture || ''
        });
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateUser(currentUser.userId, profile);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
      console.error(err);
    }
  };

  const getDashboardPath = () => {
    if (!currentUser) return "/";
    switch (currentUser.role) {
      case 'customer': return '/customer';
      case 'farmer': return '/farmer';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading your profile...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-primary mb-6">Edit Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
            <input
              type="text"
              name="profilePicture"
              value={profile.profilePicture}
              onChange={handleChange}
              placeholder="https://example.com/image.png"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg shadow-md hover:bg-green-700"
          >
            Update Profile
          </button>
        </form>
      </div>
       <div className="mt-6">
        <Link to={getDashboardPath()} className="text-green-600 font-medium hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
