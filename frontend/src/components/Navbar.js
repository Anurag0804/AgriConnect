import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import { LayoutDashboard, User, LogOut, Notebook, List, Receipt, ReceiptIndianRupee } from "lucide-react";

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
      case 'admin':
        return '/admin'; // Assuming agency maps to admin dashboard
      default:
        return '/';
    }
  };

  const getNavbarColor = () => {
    if (!user) return "bg-primary";
    switch (user.role) {
      case 'customer':
        return 'bg-primary';
      case 'farmer':
        return 'bg-yellow-500';
      case 'admin':
        return 'bg-[#8B5C2A]'; // Brown-magenta tone
      default:
        return 'bg-primary';
    }
  };

  return (
    <nav className={`${getNavbarColor()} text-white shadow-lg sticky top-0 z-50`}>
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link to={getDashboardPath()} className="text-2xl font-serif font-bold">
          🌾 AgriConnect{" "}
          <span className="text-sm font-light">
            {user ? user.role === "customer" || user.role === "farmer" || user.role=="admin" ? user.role.toUpperCase() : user.role : ''}
          </span>
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
  <>
    <Link to={getDashboardPath()} className="hover:text-gray-300">
      <LayoutDashboard className="inline-block mr-2" />
      Dashboard
    </Link>
    <Link to="/profile" className="hover:text-gray-300">
      <User className="inline-block mr-2" />
      Profile
    </Link>
    {/* ✅ Orders is now a direct link */}
    <Link to="/orders" className="hover:text-gray-300">
      <Notebook className="inline-block mr-2" />
      Orders
    </Link>
    {/* ✅ Receipts is now separate */}
    <Link to="/receipts" className="hover:text-gray-300">
      <ReceiptIndianRupee className="inline-block mr-2" />
      Receipts
    </Link>
    <button
      onClick={handleLogout}
      className="bg-accent hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-lg transition"
    >
      <LogOut className="inline-block mr-2" />
      Logout
    </button>
  </>
) : (
  <>
    <Link to="/" className="hover:text-gray-300">Home</Link>
    <Link to="/login" className="hover:text-gray-300">Login</Link>
    <Link to="/register" className="hover:text-gray-300">Register</Link>
  </>
          )}
        </div>
      </div>
    </nav>
  );
}
