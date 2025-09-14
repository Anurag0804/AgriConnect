import { useState, useEffect } from 'react';
import { getUser, updateUser } from '../services/userService';
import { getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const [profile, setProfile] = useState({
    username: '',
    phone: '',
    address: '',
    defaultLandSize: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
          address: data.address || '',
          defaultLandSize: data.defaultLandSize || '',
        });
      } catch (err) {
        setError('Failed to fetch profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]); // Added currentUser to dependency array

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const profileData = {
        username: profile.username,
        phone: profile.phone,
        address: profile.address,
        defaultLandSize: profile.defaultLandSize,
      };
      await updateUser(currentUser.userId, profileData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
      console.error(err);
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
            <label className="block text-sm font-medium text-gray-700">Default Land Size (in acres)</label>
            <input
              type="number"
              name="defaultLandSize"
              value={profile.defaultLandSize}
              onChange={handleChange}
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
        <div className="mt-6">
          <button onClick={() => navigate('/profile')} className="text-green-600 font-medium hover:underline">
            &larr; Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}