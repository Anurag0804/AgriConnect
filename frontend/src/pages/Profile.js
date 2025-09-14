import { useState, useEffect, useRef } from 'react';
import { getUser, updateUser } from '../services/userService';
import { getCurrentUser } from '../services/authService';
import { Link } from 'react-router-dom';
import { Edit, User } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    phone: '',
    address: '',
    defaultLandSize: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await updateUser(currentUser.userId, { profilePicture: reader.result });
          setProfile({ ...profile, profilePicture: reader.result });
        } catch (err) {
          setError('Failed to upload profile picture.');
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return <div className="text-center p-8">Loading your profile...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full cursor-pointer"
                onClick={handleProfilePicClick}
              />
            ) : (
              <div 
                className="w-24 h-24 rounded-full cursor-pointer bg-gray-200 flex flex-col items-center justify-center text-gray-500"
                onClick={handleProfilePicClick}
              >
                <User size={48} />
                <span className="text-xs text-center">Click to add photo</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">{profile.username}</h1>
            <p className="text-gray-500">{currentUser.role}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <p className="text-lg">{profile.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="text-lg">{profile.address}</p>
          </div>
          {currentUser.role === 'farmer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Land Size</label>
              <p className="text-lg">{profile.defaultLandSize} acres</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link to="/edit-profile" className="inline-flex items-center px-4 py-2 bg-yellow-400 text-white rounded-lg shadow-md hover:bg-yellow-500">
            <Edit className="mr-2" />
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
