export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} MandiHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
