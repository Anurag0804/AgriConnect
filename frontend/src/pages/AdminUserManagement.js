import React, { useState } from 'react';
import UserList from '../components/UserList';
import SearchBar from '../components/SearchBar';

export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>
      <SearchBar onSearch={handleSearch} />
      <UserList searchTerm={searchTerm} />
    </div>
  );
}
