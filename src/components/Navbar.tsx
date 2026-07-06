import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import SearchBar from "./SearchBar";
import { useStore } from "../store/useStore";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useStore((state) => state.logout);
  const [searchValue, setSearchValue] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") ?? "";
    setSearchValue(query);
  }, [location.search]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSearchSubmit() {
    const query = searchValue.trim();

    setIsMobileSearchOpen(false);
    navigate(query ? `/feed?q=${encodeURIComponent(query)}` : "/feed");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center gap-3 py-3 md:gap-4">
          {/* Left */}
          <div className="flex shrink-0 items-center gap-10">
            <Link to="/feed">
              <h1 className="text-2xl font-extrabold text-teal-700">
                Nobzo Lite
              </h1>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  `pb-1 text-sm font-medium transition ${
                    isActive
                      ? "border-b-2 border-teal-700 text-teal-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                Feed
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `pb-1 text-sm font-medium transition ${
                    isActive
                      ? "border-b-2 border-teal-700 text-teal-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                Admin
              </NavLink>
            </nav>
          </div>

          {/* Center Search */}
          <div className="hidden flex-1 md:flex">
            <div className="mx-auto w-full max-w-xl">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                onSubmit={handleSearchSubmit}
              />
            </div>
          </div>

          {/* Right */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `inline-flex rounded-full p-2 transition md:hidden ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
              aria-label="Open admin dashboard"
            >
              <LayoutDashboard size={20} />
            </NavLink>

            <button className="hidden lg:block rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800">
              Post Listing
            </button>

            <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
              <Bell size={20} />
            </button>

            <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
              <Settings size={20} />
            </button>

            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((open) => !open)}
              className="inline-flex rounded-full p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
              aria-label="Open search"
              aria-expanded={isMobileSearchOpen}
            >
              <Search size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {isMobileSearchOpen ? (
          <div className="pb-3 md:hidden">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={handleSearchSubmit}
              autoFocus
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
