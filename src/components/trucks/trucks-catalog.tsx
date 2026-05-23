"use client";

import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo } from "react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TruckDetailCard } from "@/components/truck-detail-card";
import { TrucksFilterSidebar } from "@/components/trucks/trucks-filter-sidebar";
import { TrucksPagination } from "@/components/trucks/trucks-pagination";
import {
  countActiveFilters,
  filterAndSortTrucks,
  PAGE_SIZE,
  paginateTrucks,
} from "@/lib/truck-filters";
import { getAllTrucks } from "@/lib/trucks-data";
import { useFilterStore } from "@/store/filter-store";
import type { SortOption } from "@/types/truck";
import { Input } from "@/components/ui/input";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "date-desc", label: "Date: Newest first" },
  { value: "date-asc", label: "Date: Oldest first" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "capacity-desc", label: "Capacity: Highest" },
];

export function TrucksCatalog() {
  const allTrucks = useMemo(() => getAllTrucks(), []);

  const filters = useFilterStore((s) => s.filters);
  const sort = useFilterStore((s) => s.sort);
  const page = useFilterStore((s) => s.page);
  const mobileFiltersOpen = useFilterStore((s) => s.mobileFiltersOpen);

  const setSearch = useFilterStore((s) => s.setSearch);
  const setLocation = useFilterStore((s) => s.setLocation);
  const setSort = useFilterStore((s) => s.setSort);
  const setPage = useFilterStore((s) => s.setPage);
  const setMobileFiltersOpen = useFilterStore((s) => s.setMobileFiltersOpen);
  const resetFilters = useFilterStore((s) => s.resetFilters);
  const activeFilterCount = useFilterStore((s) =>
    countActiveFilters(s.filters)
  );

  const filtered = useMemo(
    () => filterAndSortTrucks(allTrucks, filters, sort),
    [allTrucks, filters, sort]
  );

  const { items, page: safePage, totalPages, totalItems } = useMemo(
    () => paginateTrucks(filtered, page, PAGE_SIZE),
    [filtered, page]
  );

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-zinc-800 bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="font-semibold uppercase tracking-widest text-orange-500">
              Our fleet
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              Find your truck
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Filters update in real time. Search by keyword, location, category,
              and price.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <Input
                  type="search"
                  placeholder="Search trucks, brands, types..."
                  value={filters.search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 border-zinc-700 bg-zinc-900 pl-10 text-white"
                />
              </div>
              <div className="relative flex-1 lg:max-w-xs">
                <MapPin
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <Input
                  type="search"
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11 border-zinc-700 bg-zinc-900 pl-10 text-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-900 lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <label className="flex items-center gap-2 text-sm text-zinc-400">
                Sort by
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm font-medium text-white outline-none focus:border-orange-500/50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-medium text-orange-500 hover:text-orange-400"
                >
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            <TrucksFilterSidebar className="hidden w-72 shrink-0 lg:block" />

            <div className="min-w-0 flex-1">
              <p className="mb-6 text-sm text-zinc-500">
                Showing {items.length} of {totalItems} trucks
                {filters.location.trim() && (
                  <span>
                    {" "}
                    near <span className="text-zinc-300">{filters.location}</span>
                  </span>
                )}
              </p>

              {items.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {items.map((truck) => (
                    <TruckDetailCard key={truck.id} truck={truck} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-16 text-center">
                  <p className="text-lg font-semibold">No trucks found</p>
                  <p className="mt-2 text-zinc-400">
                    Try adjusting your filters or search term.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold hover:bg-orange-600"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              <TrucksPagination
                page={safePage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </main>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-black p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg border border-zinc-700 p-2"
              >
                <X size={18} />
              </button>
            </div>
            <TrucksFilterSidebar className="border-0 bg-transparent p-0" />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-2xl bg-orange-500 py-3 font-semibold hover:bg-orange-600"
            >
              Show {totalItems} result{totalItems === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
