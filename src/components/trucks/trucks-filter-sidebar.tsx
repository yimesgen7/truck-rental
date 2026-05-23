"use client";

import { CAPACITY_RANGE, PRICE_RANGE } from "@/lib/truck-filters";
import {
  getTruckLocations,
  transmissionOptions,
  truckTypeOptions,
} from "@/lib/trucks-data";
import { useFilterStore } from "@/store/filter-store";
import type { Transmission } from "@/types/truck";

type TrucksFilterSidebarProps = {
  className?: string;
};

export function TrucksFilterSidebar({ className }: TrucksFilterSidebarProps) {
  const filters = useFilterStore((s) => s.filters);
  const setLocation = useFilterStore((s) => s.setLocation);
  const setPriceMin = useFilterStore((s) => s.setPriceMin);
  const setPriceMax = useFilterStore((s) => s.setPriceMax);
  const setCapacityMin = useFilterStore((s) => s.setCapacityMin);
  const toggleType = useFilterStore((s) => s.toggleType);
  const toggleTransmission = useFilterStore((s) => s.toggleTransmission);
  const setAvailability = useFilterStore((s) => s.setAvailability);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const locations = getTruckLocations();

  return (
    <aside
      className={`space-y-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-medium text-orange-500 hover:text-orange-400"
        >
          Reset
        </button>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300">Location</h3>
        <input
          type="search"
          list="truck-locations"
          value={filters.location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or state..."
          className="mt-3 h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-white outline-none placeholder:text-zinc-500 focus-visible:border-orange-500/50"
        />
        <datalist id="truck-locations">
          {locations.map((loc) => (
            <option key={loc} value={loc} />
          ))}
        </datalist>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300">
          Price range ($/day)
        </h3>
        <div className="mt-3 space-y-4">
          <div>
            <label className="text-xs text-zinc-500">
              Min: ${filters.priceMin}
            </label>
            <input
              type="range"
              min={PRICE_RANGE.min}
              max={PRICE_RANGE.max}
              step={10}
              value={filters.priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              className="mt-1 w-full accent-orange-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">
              Max: ${filters.priceMax}
            </label>
            <input
              type="range"
              min={PRICE_RANGE.min}
              max={PRICE_RANGE.max}
              step={10}
              value={filters.priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="mt-1 w-full accent-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Capacity */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300">Capacity (min)</h3>
        <div className="mt-3 space-y-3">
          <input
            type="range"
            min={CAPACITY_RANGE.min}
            max={CAPACITY_RANGE.max}
            step={500}
            value={filters.capacityMin}
            onChange={(e) => setCapacityMin(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <p className="text-xs text-zinc-500">
            {filters.capacityMin === 0
              ? "Any capacity"
              : `At least ${filters.capacityMin.toLocaleString()} kg`}
          </p>
        </div>
      </div>

      {/* Truck category */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300">Truck category</h3>
        <ul className="mt-3 space-y-2">
          {truckTypeOptions.map((type) => (
            <li key={type.id}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type.id)}
                  onChange={() => toggleType(type.id)}
                  className="size-4 rounded border-zinc-600 accent-orange-500"
                />
                {type.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Transmission */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300">Transmission</h3>
        <ul className="mt-3 space-y-2">
          {transmissionOptions.map((transmission) => (
            <li key={transmission}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={filters.transmissions.includes(transmission)}
                  onChange={() =>
                    toggleTransmission(transmission as Transmission)
                  }
                  className="size-4 rounded border-zinc-600 accent-orange-500"
                />
                {transmission}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300">Availability</h3>
        <ul className="mt-3 space-y-2">
          {(
            [
              { value: "all", label: "All trucks" },
              { value: "available", label: "Available now" },
              { value: "unavailable", label: "Currently booked" },
            ] as const
          ).map((option) => (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === option.value}
                  onChange={() => setAvailability(option.value)}
                  className="size-4 border-zinc-600 accent-orange-500"
                />
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
