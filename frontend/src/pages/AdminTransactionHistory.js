import TransactionList from '../components/TransactionList';

export default function AdminTransactionHistory() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Transaction History</h1>
      <TransactionList />
    </div>
  );
}
