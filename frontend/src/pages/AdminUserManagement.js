import UserList from '../components/UserList';

export default function AdminUserManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>
      <UserList />
    </div>
  );
}
