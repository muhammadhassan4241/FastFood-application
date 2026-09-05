import { useState } from "react";
import {
  ShoppingBasket,
  Sun,
  Moon,
  LayoutDashboard,
  Menu as MenuIcon,
  Clock,
  Home,
  Utensils,
  X,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

function Header({ page, setPage, cartCount, onOpenCart, theme, toggleTheme, onOwner }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home", icon: Home },
    { id: "menu", label: "Menu", icon: Utensils },
    { id: "tracking", label: "Track Order", icon: Clock },
  ];

  const handleNavClick = (id) => {
    setPage(id);
    setMobileMenuOpen(false);
  };

  const handleOwnerClick = () => {
    onOwner();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 px-3 py-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80 sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="group flex items-center gap-2 text-left"
            aria-label="Food World home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500 text-base font-black text-white shadow-lg shadow-orange-500/20 transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105 sm:h-10 sm:w-10 sm:text-lg">
              F
            </span>
            <span className="hidden text-base font-black tracking-tight text-zinc-900 dark:text-white xs:inline sm:text-lg">
              FOOD <span className="text-orange-500">WORLD</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 rounded-full border border-zinc-200/80 bg-zinc-50/80 p-1 dark:border-white/10 dark:bg-white/5 sm:flex">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition duration-300 ${
                  page === id
                    ? "bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900"
                    : "text-zinc-500 hover:text-orange-500"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop Owner Portal Link */}
            <button
              onClick={handleOwnerClick}
              className="hidden items-center gap-2 rounded-full border border-orange-500/30 px-3.5 py-2 text-xs font-bold text-orange-500 transition hover:-translate-y-0.5 hover:bg-orange-500/10 md:inline-flex"
            >
              <LayoutDashboard size={15} />
              <span>Owner Portal</span>
            </button>

            {/* Mobile Owner Portal Quick Access Button */}
            <button
              onClick={handleOwnerClick}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/30 text-orange-500 transition hover:bg-orange-500/10 md:hidden"
              aria-label="Owner Portal"
              title="Owner Portal"
            >
              <LayoutDashboard size={16} />
            </button>

            {/* Mobile Track Order Quick Button */}
            <button
              onClick={() => handleNavClick("tracking")}
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-zinc-500 transition hover:border-orange-500 hover:text-orange-500 sm:hidden ${
                page === "tracking"
                  ? "border-orange-500 bg-orange-500/10 text-orange-500"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
              aria-label="Track Order"
              title="Track Order"
            >
              <Clock size={16} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-orange-500 hover:text-orange-500 dark:border-zinc-700 sm:h-10 sm:w-10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile Hamburger Menu Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:border-orange-500 hover:text-orange-500 dark:border-zinc-700 dark:text-zinc-300 sm:hidden"
              aria-label="Open navigation menu"
            >
              <MenuIcon size={17} />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-2 text-xs font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-400 sm:px-3.5 sm:py-2.5 sm:text-sm"
              aria-label="View Cart"
            >
              <ShoppingBasket size={16} />
              <span>{cartCount}</span>
              {cartCount > 0 && (
                <span className="cart-pulse absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[9px] font-black text-white dark:bg-white dark:text-zinc-950">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Backdrop & Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto flex h-full w-4/5 max-w-xs flex-col justify-between border-l border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 font-black text-white">
                    F
                  </span>
                  <span className="font-black tracking-tight text-zinc-900 dark:text-white">
                    FOOD <span className="text-orange-500">WORLD</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-6 space-y-1.5">
                <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Navigation
                </p>
                {navLinks.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      page === id
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{label}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-60" />
                  </button>
                ))}
              </div>

              {/* Owner Portal Link in Mobile Drawer */}
              <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-orange-500">
                  Restaurant Staff
                </p>
                <button
                  onClick={handleOwnerClick}
                  className="mt-2 flex w-full items-center justify-between rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-500 hover:text-white dark:text-orange-400"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    <span>Owner Dashboard</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="border-t border-zinc-100 pt-4 text-xs text-zinc-400 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-orange-500" />
                <span>Food World POS v2.0</span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">Fast, fresh & secure ordering</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
