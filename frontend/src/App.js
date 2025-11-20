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
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Orders from "./pages/Orders";
import Receipts from "./pages/Receipts";
import MyCart from "./pages/MyCart";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminCropManagement from "./pages/AdminCropManagement";
import AdminInventoryManagement from "./pages/AdminInventoryManagement";
import AdminTransactionHistory from "./pages/AdminTransactionHistory";
import AdminOrderManagement from "./pages/AdminOrderManagement";
import AdminReceiptManagement from "./pages/AdminReceiptManagement";
import DashboardVendor from "./pages/DashboardVendor";

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
              path="/profile"
              element={
                <ProtectedRoute roles={["customer", "farmer", "admin", "vendor"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute roles={["customer", "farmer", "admin", "vendor"]}>
                  <EditProfile />
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
            <Route
              path="/my-cart"
              element={
                <ProtectedRoute roles={["customer"]}>
                  <MyCart />
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

            {/* Vendor Routes */}
            <Route
              path="/vendor"
              element={
                <ProtectedRoute roles={["vendor"]}>
                  <DashboardVendor />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminUserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/crops"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminCropManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminInventoryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminTransactionHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminOrderManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/receipts"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminReceiptManagement />
                </ProtectedRoute>
              }
            />

            {/* Order Routes */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute roles={["customer", "farmer"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receipts"
              element={
                <ProtectedRoute roles={["customer", "farmer"]}>
                  <Receipts />
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
