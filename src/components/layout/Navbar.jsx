import { LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');



  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🇫​🇮​🇳​🇩​🇲​🇾​🇼​🇴​🇷​🇰
          </Link>


          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Find Jobs
            </Link>
            <Link to="/applied-jobs" className="text-gray-700 hover:text-blue-600 font-medium">
              Applied Jobs
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}