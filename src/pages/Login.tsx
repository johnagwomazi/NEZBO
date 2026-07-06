import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Sparkles, Eye, EyeOff } from "lucide-react";
import { useStore } from "../store/useStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed");
    }
  }, [isAuthenticated, navigate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    login({
      id: 1,
      name: email.split("@")[0] || "Test User",
      email,
    });
    navigate("/feed");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sm:p-10">
        
        {/* Branding Elements Headers */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles size={12} />
            Nobzo Lite
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Welcome Back
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Sign in to continue exploring listings.
          </p>
        </div>

        {/* Core Interactive Login Form Block Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field Panel */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 transition-all focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10">
              <Mail size={16} className="shrink-0 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field Panel */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-slate-700">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 transition-all focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10">
              <LockKeyhole size={16} className="shrink-0 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Standard Meta Row: Remember Me & Forgot Password placement right below inputs */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/20"
              />
              <span className="text-xs font-medium text-slate-600">Remember me</span>
            </label>
            <a 
              href="#forgot" 
              onClick={(e) => e.preventDefault()} 
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Notification Block */}
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-medium text-rose-600 transition">
              ⚠️ {error}
            </div>
          )}

          {/* Submission Action Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.99]"
          >
            Sign In
          </button>
        </form>

        {/* Secondary registration route navigation note */}
        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{" "}
          <a href="#register" onClick={(e) => e.preventDefault()} className="font-semibold text-brand-600 hover:text-brand-700 transition">
            Create an account
          </a>
        </p>

      </div>
    </main>
  );
}
