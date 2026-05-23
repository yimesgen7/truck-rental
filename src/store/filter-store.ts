import { create } from "zustand";

import { defaultFilters } from "@/lib/truck-filters";
import type { SortOption, TruckFilters, Transmission } from "@/types/truck";

type FilterState = {
  filters: TruckFilters;
  sort: SortOption;
  page: number;
  mobileFiltersOpen: boolean;

  setSearch: (search: string) => void;
  setLocation: (location: string) => void;
  setTypes: (types: string[]) => void;
  toggleType: (typeId: string) => void;
  setTransmissions: (transmissions: Transmission[]) => void;
  toggleTransmission: (transmission: Transmission) => void;
  setAvailability: (availability: TruckFilters["availability"]) => void;
  setPriceMin: (priceMin: number) => void;
  setPriceMax: (priceMax: number) => void;
  setCapacityMin: (capacityMin: number) => void;
  patchFilters: (partial: Partial<TruckFilters>) => void;
  setSort: (sort: SortOption) => void;
  setPage: (page: number) => void;
  setMobileFiltersOpen: (open: boolean) => void;
  resetFilters: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  sort: "price-asc",
  page: 1,
  mobileFiltersOpen: false,

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
      page: 1,
    })),

  setLocation: (location) =>
    set((state) => ({
      filters: { ...state.filters, location },
      page: 1,
    })),

  setTypes: (types) =>
    set((state) => ({
      filters: { ...state.filters, types },
      page: 1,
    })),

  toggleType: (typeId) =>
    set((state) => {
      const types = state.filters.types.includes(typeId)
        ? state.filters.types.filter((id) => id !== typeId)
        : [...state.filters.types, typeId];
      return { filters: { ...state.filters, types }, page: 1 };
    }),

  setTransmissions: (transmissions) =>
    set((state) => ({
      filters: { ...state.filters, transmissions },
      page: 1,
    })),

  toggleTransmission: (transmission) =>
    set((state) => {
      const transmissions = state.filters.transmissions.includes(transmission)
        ? state.filters.transmissions.filter((t) => t !== transmission)
        : [...state.filters.transmissions, transmission];
      return { filters: { ...state.filters, transmissions }, page: 1 };
    }),

  setAvailability: (availability) =>
    set((state) => ({
      filters: { ...state.filters, availability },
      page: 1,
    })),

  setPriceMin: (priceMin) =>
    set((state) => ({
      filters: {
        ...state.filters,
        priceMin: Math.min(priceMin, state.filters.priceMax),
      },
      page: 1,
    })),

  setPriceMax: (priceMax) =>
    set((state) => ({
      filters: {
        ...state.filters,
        priceMax: Math.max(priceMax, state.filters.priceMin),
      },
      page: 1,
    })),

  setCapacityMin: (capacityMin) =>
    set((state) => ({
      filters: { ...state.filters, capacityMin },
      page: 1,
    })),

  patchFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
      page: 1,
    })),

  setSort: (sort) => set({ sort, page: 1 }),

  setPage: (page) => set({ page }),

  setMobileFiltersOpen: (mobileFiltersOpen) => set({ mobileFiltersOpen }),

  resetFilters: () =>
    set({
      filters: defaultFilters,
      sort: "price-asc",
      page: 1,
    }),
}));
