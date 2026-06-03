// import { ArrowUpRightIcon, BikeIcon, ChevronDownIcon, LogOutIcon, MapPinIcon, MenuIcon, PackageIcon, SearchIcon, ShieldIcon, ShoppingCartIcon, UserIcon, XIcon } from "lucide-react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router";

// const Navbar = () => {
//     // const user: any = {
//     //     name: "john deo", email: "john@test.com",
//     //     isAdmin: true
//     // }
//     const user: any = null;
//     const { cartCount, setIsCartOpen } = {
//         cartCount: 5,
//         setIsCartOpen: (_data: any) => { }
//     };
//     const [searchQuery, setSearchQuery] = useState("");
//     const [userMenuOpen, setUserMenuOpen] = useState(false);
//     const navigate = useNavigate();

//     const handleSearch = (e: React.SubmitEvent) => {
//         e.preventDefault()
//         if (searchQuery.trim()) {
//             navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
//             setSearchQuery("")
//         }
//     }

//     const handleLogout = () => {
//         setUserMenuOpen(false)
//         navigate("/")
//     }
//     return (
//         <nav className="bg-white sticky top-0 z-50 border-b border-app-border">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center
//         justify-between h-16 gap-4">
//                 <Link to='/' className="flex items-center gap-2 text-[22px] font-medium shrink-0">
//                     <BikeIcon size={24} /> Instacart
//                 </Link>

//                 <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
//                     <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
//                         <Link to="/">Home</Link>
//                         <Link to="/products">Products</Link>
//                         <Link to="/deals" className="text-app-orange">Deal</Link>
//                     </div>
//                     {/* Search */}
//                     <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm">
//                         <div className="relative w-full">
//                             <SearchIcon className="absolute left-2.5 top-1/2
//                             -translate-y-1/2 size-4 text-zinc-500"/>
//                             <input
//                                 type="text"
//                                 placeholder="Search for goroceries..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-full pl-8 p-2 bg-orange-50 rounded-full
//                                 ring ring-app-orange/15 focus:ring-app-orange/30"
//                             />
//                         </div>
//                     </form>

//                     {/* right actions */}
//                     <div className="flex items-center gap-3">
//                         <button className="relative p-2 rounded-xl" onClick={() => setIsCartOpen(true)}>
//                             <ShoppingCartIcon className="size-5 text-zinc-900" />
//                             {cartCount > 0 && <span className="absolute -top-1 -right-1 size-4
//                             bg-app-orange text-white text-[10px] rounded-full
//                             flex-center">{cartCount}</span>}
//                         </button>
//                         {/* User */}

//                         <div className="relative">
//                             {user ? (
//                                 <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2">
//                                     <div className="size-7 rounded-full bg-green-950 text-white flex-center">
//                                         {user.name.charAt(0).toUpperCase()}
//                                     </div>
//                                     <ChevronDownIcon className="size" />
//                                 </button>
//                             ) : (
//                                 <div className="flex-center gap-2">
//                                     <Link to="/login" className="hidden
//                                     md:flex items-center-safe gap-2 px-4 py-2 text-sm font-medium
//                                     text-white bg-green-950 rounded-full hover:bg-green-950-light transition-co">
//                                         <UserIcon size={16} /> Sign Up
//                                     </Link>
//                                     {userMenuOpen ?
//                                         <XIcon className="md:hidden" onClick={() => setUserMenuOpen(!userMenuOpen)} />
//                                         :
//                                         <MenuIcon className="md:hidden" onClick={() => setUserMenuOpen(!userMenuOpen)} />}

//                                 </div>
//                             )}

//                             {userMenuOpen && (
//                                 <>
//                                     {/* Backdrop — self-closing so it CANNOT swallow link clicks */}
//                                     <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />

//                                     {/* Dropdown — sibling of the backdrop, not a child */}
//                                     <div className="absolute right-1 mt-26 w-56
//       bg-white rounded-xl shadow-lg border border-app-border py-2 z-50 animate-fade-in">

//                                         {user && (
//                                             <div className="px-4 py-2 border-b border-app-border">
//                                                 <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
//                                                 <p className="text-sm text-zinc-500">{user?.email}</p>
//                                             </div>
//                                         )}

//                                         <div onClick={() => setUserMenuOpen(false)}>
//                                             {!user && <Link to="/login" className="dropdown-link"><UserIcon size={16} /> Sign In</Link>}
//                                             {user && <Link to="/orders" className="dropdown-link"><PackageIcon size={16} />My Orders</Link>}
//                                             {user && <Link to="/addresses" className="dropdown-link"><MapPinIcon size={16} /> Addresses</Link>}
//                                             <Link to="/products" className="dropdown-link md:hidden"><ArrowUpRightIcon size={16} /> Products</Link>
//                                             <Link to="/deals" className="dropdown-link md:hidden"><ArrowUpRightIcon size={16} /> Deals</Link>

//                                             {user?.isAdmin && (
//                                                 <Link to="/admin/products" className="dropdown-link md:hidden">
//                                                     <ShieldIcon className="text-app-orange-dark" size={16} />
//                                                     <span className="text-app-orange-dark">Admin Panel</span>
//                                                 </Link>
//                                             )}

//                                             {user && (
//                                                 <div className="border-t border-app-border pt-1">
//                                                     <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5
//               text-sm text-app-error hover:bg-red-50 w-full transition-colors">
//                                                         <LogOutIcon size={16} /> Logout
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </nav>
//     )
// }

// export default Navbar






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

const Navbar = () => {
  // const user: any = null;
  const user: any = { name: "John Doe", email: "john@test.com", isAdmin: true };

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