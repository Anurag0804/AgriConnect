import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardCustomer from "./pages/DashboardCustomer";
import DashboardFarmer from "./pages/DashboardFarmer";
import DashboardAdmin from "./pages/DashboardAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import PurchaseHistory from "./pages/PurchaseHistory";
import CustomerInventory from "./pages/CustomerInventory";
import FarmerHistory from "./pages/FarmerHistory";
import Profile from "./pages/Profile"; // Import new page

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile" // Add new route
              element={
                <ProtectedRoute roles={["customer", "farmer", "agency", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Customer Routes */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute roles={["customer"]}>
                  <DashboardCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history/customer"
              element={
                <ProtectedRoute roles={["customer"]}>
                  <PurchaseHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/customer"
              element={
                <ProtectedRoute roles={["customer"]}>
                  <CustomerInventory />
                </ProtectedRoute>
              }
            />

            {/* Farmer Routes */}
            <Route
              path="/farmer"
              element={
                <ProtectedRoute roles={["farmer"]}>
                  <DashboardFarmer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history/farmer"
              element={
                <ProtectedRoute roles={["farmer"]}>
                  <FarmerHistory />
                </ProtectedRoute>
              }
            />

            {/* Admin/Agency Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["agency", "admin"]}>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
