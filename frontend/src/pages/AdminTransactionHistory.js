import React, { useState } from 'react';
import TransactionList from '../components/TransactionList';
import SearchBar from '../components/SearchBar';

export default function AdminTransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Transaction History</h1>
      <SearchBar onSearch={handleSearch} />
      <TransactionList searchTerm={searchTerm} />
    </div>
  );
}
