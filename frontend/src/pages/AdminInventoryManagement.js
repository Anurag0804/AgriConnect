import React, { useState } from 'react';
import InventoryList from '../components/InventoryList';
import SearchBar from '../components/SearchBar';

export default function AdminInventoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Inventory Management</h1>
      <SearchBar onSearch={handleSearch} />
      <InventoryList searchTerm={searchTerm} />
    </div>
  );
}
