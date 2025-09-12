import React, { useState } from 'react';
import CropList from '../components/CropList';
import SearchBar from '../components/SearchBar';

export default function AdminCropManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Crop Management</h1>
      <SearchBar onSearch={handleSearch} />
      <CropList searchTerm={searchTerm} />
    </div>
  );
}
