import React, { useState } from 'react';
import ReceiptList from '../components/ReceiptList';
import SearchBar from '../components/SearchBar';

export default function AdminReceiptManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Receipt Management</h1>
      <SearchBar onSearch={handleSearch} />
      <ReceiptList searchTerm={searchTerm} />
    </div>
  );
}
