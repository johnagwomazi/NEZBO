import { useEffect, useState } from "react";
import {
  Building2,
  Heart,
  LoaderCircle,
  MessageCircle,
  PencilLine,
  Trash2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardSkeleton from "../components/DashboardSkeleton";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { getProperties, getUsers } from "../services/propertyService";
import { useStore } from "../store/useStore";
import type { Property, User } from "../types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminDashboard() {
  const properties = useStore((state) => state.properties);
  const comments = useStore((state) => state.comments);
  const likes = useStore((state) => state.likes);
  const loading = useStore((state) => state.loading);
  const setProperties = useStore((state) => state.setProperties);
  const setLoading = useStore((state) => state.setLoading);
  const removeProperty = useStore((state) => state.removeProperty);
  const [users, setUsers] = useState<User[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAdminData() {
      setLoading(true);

      const [propertyData, userData] = await Promise.all([
        properties.length > 0 ? Promise.resolve(properties) : getProperties(),
        getUsers(),
      ]);

      if (active) {
        if (properties.length === 0) {
          setProperties(propertyData);
        }
        setUsers(userData);
        setLoading(false);
      }
    }

    loadAdminData();

    return () => {
      active = false;
    };
  }, []);

  const totalLikes = likes.length;
  const isPageLoading = loading || properties.length === 0 || users.length === 0;

  async function handleDeleteProperty(propertyId: number) {
    const property = properties.find((item) => item.id === propertyId);

    if (!property) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${property.title}"? This will also remove its comments and likes.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(propertyId);

    try {
      await removeProperty(propertyId);
    } finally {
      setDeletingId(null);
    }
  }

  if (isPageLoading) {
    return (
      <div>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main
        id="top"
        className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:gap-6 sm:py-8 lg:grid-cols-[280px_1fr] lg:px-8"
      >
        <Sidebar />

        <section className="space-y-4 sm:space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 sm:text-sm sm:tracking-[0.22em]">
              Admin Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Platform overview
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 sm:gap-4">
            <StatCard
              label="Total Properties"
              value={properties.length}
              accent="bg-brand-100"
              Icon={Building2}
            />
            <StatCard
              label="Total Users"
              value={users.length}
              accent="bg-sky-100"
              Icon={Users}
            />
            <StatCard
              label="Total Comments"
              value={comments.length}
              accent="bg-amber-100"
              Icon={MessageCircle}
            />
            <StatCard
              label="Total Likes"
              value={totalLikes}
              accent="bg-rose-100"
              Icon={Heart}
            />
          </div>

         <div id="management-sections" className="w-full space-y-4 sm:space-y-6">
  {/* Balanced layout matrix giving more room back to the users list */}
  <div id="properties-and-users" className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] sm:gap-6">
    
    {/* Properties Management Panel Block */}
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          Properties Inventory
        </h2>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          Total: {properties.length}
        </span>
      </div>

      {/* Mobile-First Custom Property Cards List View */}
      <div className="mt-4 space-y-3 sm:hidden">
        {properties.map((property: Property) => (
          <div
            key={property.id}
            className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 shadow-none transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {property.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  📍 {property.location}
                </p>
              </div>
              <span className="shrink-0 rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold capitalize text-brand-700">
                {property.type}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Price
                </p>
                <p className="text-sm font-black text-brand-600">
                  {formatPrice(property.price)}
                </p>
              </div>

              {/* Compact Mobile Icon Controls */}
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/property/${property.id}`}
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition active:bg-slate-50"
                  title="Edit Property"
                >
                  <PencilLine size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteProperty(property.id)}
                  disabled={deletingId === property.id}
                  className="flex size-8 items-center justify-center rounded-lg bg-rose-50 border border-rose-100 text-rose-600 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Delete Property"
                >
                  {deletingId === property.id ? (
                    <LoaderCircle size={14} className="animate-spin text-rose-500" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Structural Property Table View (Now using space-saving action icons) */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-100 sm:block mt-5">
        <table className="min-w-full divide-y divide-slate-100 text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
            {properties.map((property: Property) => (
              <tr key={property.id} className="hover:bg-slate-50/60 transition">
                <td className="px-4 py-3 font-semibold text-slate-900 truncate max-w-[150px]">
                  {property.title}
                </td>
                <td className="px-4 py-3 text-slate-500 truncate max-w-[130px]">{property.location}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-700">
                    {property.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">
                  {formatPrice(property.price)}
                </td>
                <td className="px-4 py-3 text-right">
                  {/* Clean Desktop Icon Action buttons to save massive horizontal space */}
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/property/${property.id}`}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 bg-white shadow-sm transition hover:bg-slate-50"
                      title="Edit Property"
                    >
                      <PencilLine size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={deletingId === property.id}
                      className="inline-flex size-8 items-center justify-center rounded-lg bg-rose-600 text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                      title="Delete Property"
                    >
                      {deletingId === property.id ? (
                        <LoaderCircle size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Expanded Users Management Panel Block */}
    <div id="users" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          Platform Users
        </h2>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          Total: {users.length}
        </span>
      </div>

      {/* Desktop Structural User Table View (Now has wider columns for Name and Email) */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-100 sm:block mt-5">
        <table className="min-w-full divide-y divide-slate-100 text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/60 transition">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 font-medium truncate max-w-[180px]">
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-First Custom User Cards List View */}
      <div className="mt-4 space-y-2.5 sm:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm shadow-none"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800 text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 truncate leading-tight">{user.name}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>


          <div
            id="reports"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Reports
            </h2>
            <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-3">
              {[
                {
                  title: "Engagement Report",
                  text: "Likes and comments are growing steadily across the newest listings.",
                },
                {
                  title: "Property Health",
                  text: "Inventory is balanced between rental and sale listings for this demo.",
                },
                {
                  title: "User Activity",
                  text: "Most interactions currently come from the feed and detail views.",
                },
              ].map((report) => (
                <div
                  key={report.title}
                  className="rounded-xl bg-slate-50 p-4 sm:rounded-2xl sm:p-5"
                >
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    {report.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
                    {report.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
