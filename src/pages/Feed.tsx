import { useEffect, useMemo, useState } from "react";
import { Building2, Home, MapPin } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import FilterButtons from "../components/FilterButtons";
import PropertyCard from "../components/PropertyCard";
import PropertyCardSkeleton from "../components/PropertyCardSkeleton";

import { getProperties } from "../services/propertyService";
import { useStore } from "../store/useStore";
import type { Property } from "../types";

export default function Feed() {
  const [searchParams] = useSearchParams();

  const properties = useStore((state) => state.properties);
  const comments = useStore((state) => state.comments);
  const loading = useStore((state) => state.loading);
  const setProperties = useStore((state) => state.setProperties);
  const setLoading = useStore((state) => state.setLoading);

  const [filter, setFilter] = useState("all");

  const search = searchParams.get("q") ?? "";

  useEffect(() => {
    if (properties.length > 0) return;

    let active = true;

    async function loadProperties() {
      setLoading(true);

      const data = await getProperties();

      if (active) {
        setProperties(data);
        setLoading(false);
      }
    }

    loadProperties();

    return () => {
      active = false;
    };
  }, [properties.length, setLoading, setProperties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property: Property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || property.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [filter, properties, search]);

  const isPageLoading =
    loading || properties.length === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Hero Section */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-brand-50/30 shadow-sm md:rounded-[1.5rem]">
        <div className="p-4 sm:p-6">
          {/* Upper Content Control Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700 md:text-xs">
                Property Marketplace
              </span>

              <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                Discover Your Next Home
              </h1>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm md:mt-2 md:leading-6">
                Browse premium listings, compare properties, and find the perfect place to rent or buy.
              </p>

              {search && (
                <div className="mt-2 inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  Results for: <span className="ml-1 font-semibold text-slate-900">"{search}"</span>
                </div>
              )}
            </div>

            {/* Filter Placement Box */}
            <div className="w-full shrink-0 border-t border-slate-100 pt-3 md:w-auto md:border-0 md:pt-0">
              <FilterButtons
                value={filter}
                onChange={setFilter}
              />
            </div>
          </div>

          {/* Compact 3-Column Stats Layout (Never Breaks into Asymmetric Blocks) */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-slate-100 pt-4 sm:gap-4 md:mt-6">
            {/* Listings Stat */}
            <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                    Listings
                  </p>
                  <p className="mt-0.5 text-base font-bold text-slate-900 sm:mt-1 sm:text-2xl">
                    {filteredProperties.length}
                  </p>
                </div>
                <div className="shrink-0 rounded-lg bg-brand-50 p-1.5 sm:rounded-xl sm:p-2.5">
                  <Home size={14} className="text-brand-700 sm:size-5" />
                </div>
              </div>
            </div>

            {/* Categories Stat */}
            <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                    Categories
                  </p>
                  <p className="mt-0.5 text-base font-bold text-slate-900 sm:mt-1 sm:text-2xl">
                    2
                  </p>
                </div>
                <div className="shrink-0 rounded-lg bg-emerald-50 p-1.5 sm:rounded-xl sm:p-2.5">
                  <Building2 size={14} className="text-emerald-600 sm:size-5" />
                </div>
              </div>
            </div>

            {/* Locations Stat */}
            <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                    Locations
                  </p>
                  <p className="mt-0.5 text-base font-bold text-slate-900 sm:mt-1 sm:text-2xl">
                    {new Set(properties.map((p) => p.location)).size}
                  </p>
                </div>
                <div className="shrink-0 rounded-lg bg-sky-50 p-1.5 sm:rounded-xl sm:p-2.5">
                  <MapPin size={14} className="text-sky-600 sm:size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


        {/* Results Header */}
        {!isPageLoading && (
          <div className="mt-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Available Properties
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredProperties.length} properties found
              </p>
            </div>
          </div>
        )}

      {/* Container Grid for 2 Columns on Mobile, 2 Columns on Small/Medium, 3 Columns on Large/Desktop */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {isPageLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))
        ) : (
          filteredProperties.map((property) => {
            const commentCount = comments.filter(
              (comment) => comment.propertyId === property.id
            ).length;

            return (
              <PropertyCard
                key={property.id}
                property={property}
                commentCount={commentCount}
              />
            );
          })
        )}
      </div>


        {/* Empty State */}
        {!isPageLoading &&
          filteredProperties.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Home
                  size={28}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No properties found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your filter or search
                query.
              </p>
            </div>
          )}
      </main>
    </div>
  );
}