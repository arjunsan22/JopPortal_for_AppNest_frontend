// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-lg font-semibold text-white mb-2">JobPortal</p>
        <p className="text-sm">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}