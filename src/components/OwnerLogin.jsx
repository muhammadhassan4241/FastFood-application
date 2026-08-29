import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { supabase } from "../supabaseClient";

const OWNER_EMAIL = "muhammadhassanattari450@gmail.com";

function OwnerLogin({ onLoggedIn }) {
  const [email, setEmail] = useState("muhammadhassanattari450@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) setError(authError.message);
    else if (data.user?.email?.toLowerCase() !== OWNER_EMAIL) {
      await supabase.auth.signOut();
      setError("This account is not authorized for the Food World owner dashboard.");
    } else onLoggedIn(data.user);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 text-white">
      <div className="pointer-events-none fixed -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-20 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-orange-950/30 lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-orange-500 to-amber-500 p-10 text-zinc-950 lg:flex">
          <div><div className="flex items-center gap-2 text-xl font-black">F~FOOD <span>WORLD':)</span></div><p className="mt-3 max-w-sm text-sm font-medium text-orange-950/75">Run your restaurant with clarity. Track sales, manage your catalog, and keep every order moving.</p></div>
          <div><p className="max-w-md text-4xl font-black leading-tight">Everything your kitchen needs, in one calm workspace.</p><div className="mt-8 grid grid-cols-3 gap-3 text-xs font-bold"><div className="rounded-2xl bg-white/25 p-3">Sales<br /><span className="text-orange-950/65">Live insights</span></div><div className="rounded-2xl bg-white/25 p-3">Stock<br /><span className="text-orange-950/65">Stay ready</span></div><div className="rounded-2xl bg-white/25 p-3">Orders<br /><span className="text-orange-950/65">Move faster</span></div></div></div>
        </div>
        <div className="p-7 sm:p-12">
          <div className="mb-10"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-xl font-black text-white">F</div><p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Owner access</p><h1 className="mt-2 text-3xl font-black">Welcome back.</h1><p className="mt-2 text-sm text-zinc-400">Sign in to open your Food World POS dashboard.</p></div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-zinc-300">Email address<div className="relative mt-2"><Mail className="absolute left-3 top-3.5 text-zinc-500" size={18} /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 outline-none transition focus:border-orange-500" /></div></label>
            <label className="block text-sm font-semibold text-zinc-300">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3.5 text-zinc-500" size={18} /><input required minLength={6} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 outline-none transition focus:border-orange-500" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-zinc-500 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-sm text-red-300">{error}</p>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white transition hover:bg-orange-400 disabled:opacity-50">{loading ? "Signing in..." : "Open dashboard"}<ArrowRight size={18} /></button>
          </form>
          <p className="mt-8 text-center text-xs text-zinc-500">Only authorized Food World owners can access this area.</p>
        </div>
      </div>
    </main>
  );
}

export default OwnerLogin;
