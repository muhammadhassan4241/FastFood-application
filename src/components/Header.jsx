import { ShoppingBasket, Sun, Moon, LayoutDashboard, Menu as MenuIcon } from "lucide-react";

function Header({ page, setPage, cartCount, onOpenCart, theme, toggleTheme, onOwner }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/75 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/75 sm:px-6 md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <button onClick={() => setPage("home")} className="group flex items-center gap-2" aria-label="Food World home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">F</span>
          <span className="hidden text-lg font-black tracking-tight text-zinc-900 dark:text-white sm:inline">FOOD <span className="text-orange-500">WORLD</span></span>
        </button>
        <nav className="hidden items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50/80 p-1 dark:border-white/10 dark:bg-white/5 sm:flex">
          {[['home', 'Home'], ['menu', 'Menu']].map(([id, label]) => <button key={id} onClick={() => setPage(id)} className={`rounded-full px-4 py-2 text-sm font-bold transition duration-300 ${page === id ? "bg-zinc-900 text-white shadow-md dark:bg-white dark:text-zinc-900" : "text-zinc-500 hover:text-orange-500"}`}>{label}</button>)}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onOwner} className="hidden items-center gap-2 rounded-full border border-orange-500/30 px-3.5 py-2.5 text-xs font-bold text-orange-500 transition hover:-translate-y-0.5 hover:bg-orange-500/10 md:inline-flex"><LayoutDashboard size={15} />Owner Portal</button>
          <button onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-500 dark:border-zinc-700" aria-label="Toggle theme">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button onClick={() => setPage("menu")} className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-500 dark:border-zinc-700 sm:hidden" aria-label="Open menu"><MenuIcon size={18} /></button>
          <button onClick={onOpenCart} className="relative flex items-center gap-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-400"><ShoppingBasket size={17} /><span>{cartCount}</span>{cartCount > 0 && <span className="cart-pulse absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1 text-[10px] text-white">{cartCount}</span>}</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
