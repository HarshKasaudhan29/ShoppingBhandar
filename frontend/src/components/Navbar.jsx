import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const NAV_LINKS = [
  { label: 'Men',        to: '/products?category=mens-shirts' },
  { label: 'Women',      to: '/products?category=womens-dresses' },
  { label: 'Footwear',   to: '/products?category=womens-shoes' },
  { label: 'Watches',    to: '/products?category=mens-watches' },
  { label: 'Jewellery',  to: '/products?category=womens-jewellery' },
  { label: 'Sale 🔥',    to: '/products?sort=discount' },
];

export default function Navbar() {
  const [scrolled,     setScrolled]    = useState(false);
  const [searchQuery,  setSearchQuery] = useState('');
  const [menuOpen,     setMenuOpen]    = useState(false);
  const [profileOpen,  setProfileOpen] = useState(false);
  const [searchOpen,   setSearchOpen]  = useState(false);
  const profileRef  = useRef(null);
  const searchRef   = useRef(null);
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { user }    = useSelector((s) => s.auth);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery.trim()}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>

        {/* Top promo strip */}
        <div className="bg-pink-600 text-white text-center text-xs py-1.5 font-medium tracking-wide hidden sm:block">
          🎉 FREE DELIVERY on orders above ₹999 &nbsp;|&nbsp; Use code <span className="font-black">BHANDAR10</span> for extra 10% off
        </div>

        {/* Main navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white text-xs font-black">SB</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-base font-black text-gray-900 leading-none tracking-tight">Shopping</p>
                <p className="text-[10px] font-bold text-pink-600 leading-none tracking-widest uppercase">Bhandar</p>
              </div>
            </Link>

            {/* Nav links – desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors relative group whitespace-nowrap"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </div>

            {/* Search bar – desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs lg:max-w-sm items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands…"
                  className="w-full pl-4 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-400 focus:bg-white transition-all placeholder-gray-400"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                  </svg>
                </button>
              </div>
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-1">

              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(s => !s)}
                className="md:hidden p-2 rounded-full hover:bg-pink-50 transition-colors text-gray-600 hover:text-pink-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
              </button>

              {/* Wishlist */}
              <button className="p-2 rounded-full hover:bg-pink-50 transition-colors text-gray-600 hover:text-pink-600 hidden sm:flex items-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"/>
                </svg>
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-pink-50 transition-colors text-gray-600 hover:text-pink-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                {(() => {
                  const count = JSON.parse(localStorage.getItem('cart') || '[]').reduce((s, i) => s + i.quantity, 0);
                  return count > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {count > 9 ? '9+' : count}
                    </span>
                  ) : null;
                })()}
              </Link>

              {/* Profile */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-pink-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center">
                      <span className="text-white text-xs font-black">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <svg className="w-3 h-3 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                        🛍️ My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-pink-600 transition-colors px-2 py-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/>
                  </svg>
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(m => !m)}
                className="lg:hidden p-2 rounded-full hover:bg-pink-50 transition-colors text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 bg-white border-t border-gray-100" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative mt-2">
              <input
                type="text" autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands…"
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-pink-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to} to={to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors"
              >
                {label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-pink-600 hover:bg-pink-50 rounded-xl transition-colors">
                Login / Register
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
