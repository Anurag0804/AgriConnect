import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

export default function Navbar() {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'customer':
        return '/customer';
      case 'farmer':
        return '/farmer';
      case 'agency':
        return '/admin'; // Assuming agency maps to admin dashboard
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" className="text-2xl font-serif font-bold">🌾 MandiHub</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-secondary">Home</Link>
          {user ? (
            <>
              <Link to={getDashboardPath()} className="hover:text-secondary">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-secondary">
                Profile
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-accent hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-secondary">Login</Link>
              <Link to="/register" className="hover:text-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
