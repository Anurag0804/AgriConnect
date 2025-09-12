import React, { useState } from 'react';
import OrderList from '../components/OrderList';
import SearchBar from '../components/SearchBar';

export default function AdminOrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Order Management</h1>
      <SearchBar onSearch={handleSearch} />
      <OrderList searchTerm={searchTerm} />
    </div>
  );
}
