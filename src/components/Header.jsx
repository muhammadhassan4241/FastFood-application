import { ShoppingBasket, Sun, Moon } from "lucide-react";

function Header({ page, setPage, cartCount, onOpenCart, theme, toggleTheme }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-orange-500/20 px-5 md:px-10 py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setPage("home")} className="flex items-center gap-1.5">
          <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            F~FOOD
          </span>
          <span className="text-2xl font-black tracking-tight text-orange-500">WORLD':)</span>
        </button>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-8">
          <button
            onClick={() => setPage("home")}
            className={`text-sm font-medium transition-colors ${
              page === "home"
                ? "text-orange-500"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setPage("menu")}
            className={`text-sm font-medium transition-colors ${
              page === "menu"
                ? "text-orange-500"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Menu
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-orange-500" />
            ) : (
              <Moon size={18} className="text-zinc-700" />
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-orange-500/30 rounded-full pl-3.5 pr-4 py-2.5 transition-all"
          >
            <ShoppingBasket size={18} className="text-orange-500" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              {cartCount}
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;