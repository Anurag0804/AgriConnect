import { useState, useEffect } from 'react';
import { getAllCrops, createCrop, updateCrop, deleteCrop } from '../services/cropService';

export default function CropList({ searchTerm }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCrop, setEditingCrop] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, [searchTerm]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const data = await getAllCrops(searchTerm);
      setCrops(data);
    } catch (err) {
      setError('Failed to fetch crops.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await deleteCrop(cropId);
        fetchCrops();
      } catch (err) {
        setError('Failed to delete crop.');
        console.error(err);
      }
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
  };

  const handleCreate = () => {
    setEditingCrop({ name: '', stock: 0, pricePerKg: 0, location: '' });
    setIsCreating(true);
  };

  const handleSave = async (cropId, cropData) => {
    try {
      if (isCreating) {
        await createCrop(cropData);
      } else {
        await updateCrop(cropId, cropData);
      }
      setEditingCrop(null);
      setIsCreating(false);
      fetchCrops();
    } catch (err) {
      setError('Failed to save crop.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading crops...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Crop Management</h2>
        <button onClick={handleCreate} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Crop</button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Kg</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {crops.map((crop) => (
            <tr key={crop._id}>
              <td className="px-6 py-4 whitespace-nowrap">{crop.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{crop.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap">{crop.pricePerKg}</td>
              <td className="px-6 py-4 whitespace-nowrap">{crop.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">{crop.farmer?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleEdit(crop)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onClick={() => handleDelete(crop._id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingCrop && (
        <EditCropModal
          crop={editingCrop}
          onSave={handleSave}
          onClose={() => {
            setEditingCrop(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </div>
  );
}

function EditCropModal({ crop, onSave, onClose, isCreating }) {
  const [formData, setFormData] = useState({ name: '', stock: 0, pricePerKg: 0, location: '' });

  useEffect(() => {
    if (crop) {
      setFormData({ name: crop.name, stock: crop.stock, pricePerKg: crop.pricePerKg, location: crop.location });
    }
  }, [crop]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(crop._id, formData);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{isCreating ? 'Create' : 'Edit'} Crop</h3>
              <div className="mt-2">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                  <label htmlFor="pricePerKg" className="block text-sm font-medium text-gray-700">Price/Kg</label>
                  <input type="number" name="pricePerKg" id="pricePerKg" value={formData.pricePerKg} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
              <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
