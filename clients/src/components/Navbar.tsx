import {
  ArrowUpRightIcon,
  BikeIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const {user, logout} = useAuth();

  const { cartCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const closeAll = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
     

      <nav className="nb-root">
        <div className="nb-inner">

          {/* Logo */}
          <Link to="/" className="nb-logo">
            <BikeIcon size={22} />
            Instacart
          </Link>

          {/* Desktop Nav Links */}
          <div className="nb-links">
            <Link to="/" className="nb-link">Home</Link>
            <Link to="/products" className="nb-link">Products</Link>
            <Link to="/deals" className="nb-link deal">Deals</Link>
          </div>

          {/* Search Bar */}
          <div className="nb-search-wrap">
            <form className="nb-search-form" onSubmit={handleSearch}>
              <SearchIcon className="nb-search-icon" />
              <input
                type="text"
                placeholder="Search for groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nb-search-input"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="nb-actions">

            {/* Cart */}
            <button
              className="nb-icon-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <ShoppingCartIcon size={20} />
              {cartCount > 0 && (
                <span className="nb-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="nb-menu-wrap" ref={menuRef}>
                <button
                  className="nb-avatar-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  <div className="nb-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span className="nb-avatar-name">{user.name.split(" ")[0]}</span>
                  <ChevronDownIcon className="nb-avatar-chevron" />
                </button>

                {userMenuOpen && (
                  <div className="nb-dropdown" role="menu">
                    <div className="nb-dropdown-header">
                      <p className="nb-dropdown-name">{user.name}</p>
                      <p className="nb-dropdown-email">{user.email}</p>
                    </div>

                    <div className="nb-dropdown-section">
                      <Link to="/orders" className="nb-dropdown-link" onClick={() => setUserMenuOpen(false)}>
                        <PackageIcon size={15} /> My Orders
                      </Link>
                      <Link to="/addresses" className="nb-dropdown-link" onClick={() => setUserMenuOpen(false)}>
                        <MapPinIcon size={15} /> Addresses
                      </Link>
                      {user.isAdmin && (
                        <Link to="/admin/products" className="nb-dropdown-link admin" onClick={() => setUserMenuOpen(false)}>
                          <ShieldIcon size={15} /> Admin Panel
                        </Link>
                      )}
                    </div>

                    <div className="nb-dropdown-section">
                      <button className="nb-dropdown-link danger" onClick={handleLogout}>
                        <LogOutIcon size={15} /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nb-signin-btn">
                  <UserIcon size={15} /> Sign in
                </Link>
                <button
                  className="nb-icon-btn nb-hamburger"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
                </button>
              </>
            )}

            {/* Hamburger for logged-in mobile users */}
            {user && (
              <button
                className="nb-icon-btn nb-hamburger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="nb-mobile-menu">
            {/* Mobile Search (only shown on xs screens) */}
            <div className="nb-mobile-search">
              <form className="nb-search-form" onSubmit={handleSearch} style={{ width: "100%" }}>
                <SearchIcon className="nb-search-icon" />
                <input
                  type="text"
                  placeholder="Search for groceries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="nb-search-input"
                />
              </form>
            </div>

            <div className="nb-mobile-links">
              <Link to="/" className="nb-mobile-link" onClick={closeAll}>Home</Link>
              <Link to="/products" className="nb-mobile-link" onClick={closeAll}>
                <ArrowUpRightIcon size={16} /> Products
              </Link>
              <Link to="/deals" className="nb-mobile-link deal" onClick={closeAll}>
                <ArrowUpRightIcon size={16} /> Deals
              </Link>

              {user && (
                <>
                  <Link to="/orders" className="nb-mobile-link" onClick={closeAll}>
                    <PackageIcon size={16} /> My Orders
                  </Link>
                  <Link to="/addresses" className="nb-mobile-link" onClick={closeAll}>
                    <MapPinIcon size={16} /> Addresses
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin/products" className="nb-mobile-link" onClick={closeAll} style={{ color: "#c05621" }}>
                      <ShieldIcon size={16} /> Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>

            {!user ? (
              <Link to="/login" className="nb-mobile-signin" onClick={closeAll}>
                <UserIcon size={16} /> Sign in
              </Link>
            ) : (
              <button
                className="nb-mobile-signin"
                onClick={handleLogout}
                style={{ background: "#c53030", cursor: "pointer" }}
              >
                <LogOutIcon size={16} /> Log out
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;