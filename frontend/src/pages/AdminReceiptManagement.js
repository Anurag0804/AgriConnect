import ReceiptList from '../components/ReceiptList';

export default function AdminReceiptManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Receipt Management</h1>
      <ReceiptList />
    </div>
  );
}
