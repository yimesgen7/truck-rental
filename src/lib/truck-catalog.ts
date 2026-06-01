import type { TruckType } from "@prisma/client";

import { getAllTrucks } from "@/lib/trucks-data";

const categoryToTruckType: Record<string, TruckType> = {
  "heavy-duty": "HEAVY_DUTY",
  "light-commercial": "PICKUP",
  "moving-delivery": "BOX_TRUCK",
};

const catalogTruckTypeOverrides: Record<string, TruckType> = {
  "cargo-van": "CARGO_VAN",
  "flatbed-hauler": "HEAVY_DUTY",
  "refrigerated-truck": "REFRIGERATED",
  "pickup-truck": "PICKUP",
  "box-truck": "BOX_TRUCK",
};

export function resolveTruckType(catalogId: string, categoryId: string): TruckType {
  return (
    catalogTruckTypeOverrides[catalogId] ??
    categoryToTruckType[categoryId] ??
    "HEAVY_DUTY"
  );
}

export function getCatalogTruckSeedData() {
  return getAllTrucks().map((truck) => ({
    catalogId: truck.id,
    name: truck.name,
    brand: truck.brand,
    model: truck.model,
    year: new Date(truck.listedAt).getFullYear() || new Date().getFullYear(),
    type: resolveTruckType(truck.id, truck.categoryId),
    description: truck.detailedDescription,
    image: truck.image,
    pricePerDay: truck.pricePerDay,
    capacity: truck.capacityKg,
    transmission: truck.transmission,
    fuelType: "Diesel",
    location: truck.location,
    available: truck.available,
  }));
}
