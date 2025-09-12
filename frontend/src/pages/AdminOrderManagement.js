import OrderList from '../components/OrderList';

export default function AdminOrderManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Order Management</h1>
      <OrderList />
    </div>
  );
}
