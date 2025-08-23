import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
  <div className="container mx-auto flex justify-between items-center px-4 py-3">
    <Link to="/" className="text-2xl font-serif font-bold">🌾 MandiHub</Link>
    <div className="space-x-4">
      <Link to="/" className="hover:text-secondary">Home</Link>
      <Link to="/login" className="hover:text-secondary">Login</Link>
      <Link to="/register" className="hover:text-secondary">Register</Link>
    </div>
  </div>
</nav>

  );
}
