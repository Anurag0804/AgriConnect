import { Link } from "react-router-dom";
import { Users, Leaf, Shield } from "lucide-react"; // icons

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-green-100 via-yellow-50 to-green-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 flex-grow">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6">
          Welcome to AgriConnect 🌾
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
          A digital platform that bridges the gap between <span className="font-semibold">Farmers</span>,{" "}
          <span className="font-semibold">Customers</span>, and{" "}
          <span className="font-semibold">Admins</span> — making agriculture smarter and markets accessible.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-primary text-white rounded-xl shadow-lg hover:bg-green-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-secondary text-gray-900 rounded-xl shadow-lg hover:bg-yellow-600 transition"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        {/* Farmer */}
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition text-center border border-gray-200">
          <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">For Farmers</h3>
          <p className="text-gray-600">
            Sell your crops directly, access fair prices, and connect with buyers in one click.
          </p>
        </div>

        {/* Customer */}
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition text-center border border-gray-200">
          <Users className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">For Customers</h3>
          <p className="text-gray-600">
            Get fresh produce directly from farmers, ensuring quality and transparency.
          </p>
        </div>

        {/* Admin */}
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition text-center border border-gray-200">
          <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">For Admins</h3>
          <p className="text-gray-600">
            Manage marketplace operations, oversee transactions, and ensure secure exchanges.
          </p>
        </div>
      </section>

      {/* Call To Action */}
      <footer className="text-center py-8 bg-white border-t border-gray-200">
        <p className="text-gray-600">
          🌱 Use AgriConnect today and be part of the digital agriculture revolution!
        </p>
      </footer>
    </div>
  );
}
