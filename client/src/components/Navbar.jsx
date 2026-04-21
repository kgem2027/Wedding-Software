import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './authProvider.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="w-full bg-[#92a5e8] px-10 py-3 flex flex-row items-center gap-6 fixed top-0 left-0 z-50">
      <div className="mr-6">
        <NavLink to="/" className="text-white font-bold text-xl tracking-wide">
          TwoRings
        </NavLink>
      </div>
      <ul className="flex flex-row items-center gap-4 list-none m-0 p-0">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'bg-pink-300/80 text-white hover:bg-pink-400 hover:shadow-md'
              }`
            }
          >
            Home
          </NavLink>
        </li>
        {user?.role === 'client' && (
        <li>
          <NavLink
            to="/registry"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'bg-pink-300/80 text-white hover:bg-pink-400 hover:shadow-md'
              }`
            }
          >
            Registry
          </NavLink>
        </li>
        )}
        {user?.role == 'client' && (
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'bg-pink-300/80 text-white hover:bg-pink-400 hover:shadow-md'
              }`
            }
          >
            Contact
          </NavLink>
        </li>
        )}
        {user?.role === 'admin' && (
          <li>
            <NavLink
              to="/edit/roster"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-pink-400 text-white shadow-md'
                    : 'bg-pink-300/80 text-white hover:bg-pink-400 hover:shadow-md'
                }`
              }
            >
              Edit Roster
            </NavLink>
          </li>
        )}
      
          <li>
            <NavLink
              to="/weddings"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-pink-400 text-white shadow-md'
                    : 'bg-pink-300/80 text-white hover:bg-pink-400 hover:shadow-md'
                }`
              }
            >
              Weddings
            </NavLink>
          </li>
      </ul>

      {user && (
        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-semibold text-sm text-white bg-red-400/80 hover:bg-red-500 transition-all duration-200 hover:shadow-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;