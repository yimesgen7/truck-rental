import type { SortOption, Truck, TruckFilters } from "@/types/truck";

export const PRICE_RANGE = { min: 0, max: 200 };
export const CAPACITY_RANGE = { min: 0, max: 30000 };
export const PAGE_SIZE = 4;

export const defaultFilters: TruckFilters = {
  search: "",
  location: "",
  types: [],
  transmissions: [],
  availability: "all",
  priceMin: PRICE_RANGE.min,
  priceMax: PRICE_RANGE.max,
  capacityMin: CAPACITY_RANGE.min,
};

export function filterAndSortTrucks(
  trucks: Truck[],
  filters: TruckFilters,
  sort: SortOption
): Truck[] {
  const query = filters.search.trim().toLowerCase();
  const locationQuery = filters.location.trim().toLowerCase();

  let result = trucks.filter((truck) => {
    if (query) {
      const haystack = [
        truck.name,
        truck.brand,
        truck.model,
        truck.categoryName,
        truck.location,
        truck.shortDescription,
        truck.detailedDescription,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (locationQuery && !truck.location.toLowerCase().includes(locationQuery)) {
      return false;
    }

    if (filters.types.length > 0 && !filters.types.includes(truck.categoryId)) {
      return false;
    }

    if (
      filters.transmissions.length > 0 &&
      !filters.transmissions.includes(truck.transmission)
    ) {
      return false;
    }

    if (filters.availability === "available" && !truck.available) return false;
    if (filters.availability === "unavailable" && truck.available) return false;

    if (
      truck.pricePerDay < filters.priceMin ||
      truck.pricePerDay > filters.priceMax
    ) {
      return false;
    }

    if (truck.capacityKg < filters.capacityMin) return false;

    return true;
  });

  result = [...result].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.pricePerDay - b.pricePerDay;
      case "price-desc":
        return b.pricePerDay - a.pricePerDay;
      case "date-desc":
        return (
          new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
        );
      case "date-asc":
        return (
          new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime()
        );
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "capacity-desc":
        return b.capacityKg - a.capacityKg;
      default:
        return 0;
    }
  });

  return result;
}

export function paginateTrucks<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems: items.length,
  };
}

export function countActiveFilters(filters: TruckFilters): number {
  let count = 0;
  if (filters.search.trim()) count++;
  if (filters.location.trim()) count++;
  if (filters.types.length > 0) count++;
  if (filters.transmissions.length > 0) count++;
  if (filters.availability !== "all") count++;
  if (filters.priceMin > PRICE_RANGE.min || filters.priceMax < PRICE_RANGE.max)
    count++;
  if (filters.capacityMin > CAPACITY_RANGE.min) count++;
  return count;
}
