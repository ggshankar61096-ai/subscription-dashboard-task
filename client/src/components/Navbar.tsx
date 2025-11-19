import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useState, memo } from 'react';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import useTheme from '../hooks/useTheme';

interface NavLinkItemProps {
  to: string;
  label: string;
  isRegister?: boolean;
  variant?: 'default' | 'mobile';
  onClick?: () => void;
}

const NavLinkItem = memo(({ to, label, isRegister, variant = 'default', onClick }: NavLinkItemProps) => {
  const isMobile = variant === 'mobile';
  const baseClass = isRegister
    ? `px-${isMobile ? '4' : '4'} py-2 rounded text-white ${isMobile ? 'block' : ''}`
    : `px-3 py-2 rounded text-white ${isMobile ? 'block' : ''}`;

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => {
        if (isRegister) {
          return `${baseClass} ${isActive ? 'bg-green-700' : isMobile ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'}`;
        }
        return `${baseClass} ${isActive ? 'bg-blue-800' : isMobile ? 'hover:bg-blue-600' : 'hover:bg-blue-700'}`;
      }}
    >
      {label}
    </NavLink>
  );
});

NavLinkItem.displayName = 'NavLinkItem';

export default function Navbar() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-blue-600 dark:bg-slate-900 text-white shadow-lg sticky top-0 z-50 w-full transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          SubDash
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {token ? (
            <>
              <NavLinkItem to="/plans" label="Plans" />
              {user?.role === 'admin' ? (
                <NavLinkItem to="/admin/subscriptions" label="Admin" />
              ) : (
                <NavLinkItem to="/dashboard" label="Dashboard" />
              )}
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="px-2 py-1 rounded hover:bg-blue-700"
                >
                  {theme === 'dark' ? '🌙' : '🌞'}
                </button>
                
                <span className="text-sm">Hi {user?.name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="px-2 py-1 rounded hover:bg-blue-700"
              >
                {theme === 'dark' ? '🌙' : '🌞'}
              </button>
              <NavLinkItem to="/login" label="Login" />
              <NavLinkItem to="/register" label="Register" isRegister />
            </>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 dark:bg-slate-800 border-t border-blue-500 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-full text-left px-3 py-2 rounded hover:bg-blue-600 text-white"
            >
              {theme === 'dark' ? '🌙 Dark Mode' : '🌞 Light Mode'}
            </button>
            {token ? (
              <>
                <NavLinkItem to="/plans" label="Plans" variant="mobile" onClick={() => setIsMenuOpen(false)} />
                {user?.role === 'admin' ? (
                  <NavLinkItem to="/admin/subscriptions" label="Admin" variant="mobile" onClick={() => setIsMenuOpen(false)} />
                ) : (
                  <NavLinkItem to="/dashboard" label="Dashboard" variant="mobile" onClick={() => setIsMenuOpen(false)} />
                )}
                <div className="pt-3 border-t border-blue-500">
                  <p className="text-sm px-3 py-2 text-white">Hi {user?.name}!</p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-red-600 px-3 py-2 rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLinkItem to="/login" label="Login" variant="mobile" onClick={() => setIsMenuOpen(false)} />
                <NavLinkItem to="/register" label="Register" isRegister variant="mobile" onClick={() => setIsMenuOpen(false)} />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
