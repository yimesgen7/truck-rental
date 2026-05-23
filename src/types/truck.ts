export type Transmission = "Manual" | "Automatic";

export type Truck = {
  id: string;
  name: string;
  brand: string;
  model: string;
  pricePerDay: number;
  capacity: string;
  capacityKg: number;
  categoryId: string;
  categoryName: string;
  location: string;
  listedAt: string;
  transmission: Transmission;
  available: boolean;
  image: string;
  shortDescription: string;
  detailedDescription: string;
  features: string[];
};

export type TruckCategory = {
  id: string;
  name: string;
  description: string;
  trucks: Truck[];
};

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "capacity-desc";

export type TruckFilters = {
  search: string;
  location: string;
  types: string[];
  transmissions: Transmission[];
  availability: "all" | "available" | "unavailable";
  priceMin: number;
  priceMax: number;
  capacityMin: number;
};
