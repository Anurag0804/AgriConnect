import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../services/userService';
import EditUserModal from './EditUserModal';
import { useLocation } from 'react-router-dom';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(searchQuery);
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users. You might not have the required permissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers(); // Refresh the list after deletion
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
