import type { Truck, TruckCategory, Transmission } from "@/types/truck";

type TruckInput = Omit<
  Truck,
  "categoryId" | "categoryName"
>;

function withCategory(
  categoryId: string,
  categoryName: string,
  truck: TruckInput
): Truck {
  return { ...truck, categoryId, categoryName };
}

export const truckCategories: TruckCategory[] = [
  {
    id: "heavy-duty",
    name: "Heavy Duty",
    description:
      "High-capacity trucks built for industrial freight, construction materials, and long-distance hauling.",
    trucks: [
      withCategory("heavy-duty", "Heavy Duty", {
        id: "heavy-cargo",
        name: "Heavy Cargo Truck",
        brand: "Volvo",
        model: "FH16",
        pricePerDay: 120,
        capacity: "26,000 kg",
        capacityKg: 26000,
        location: "Chicago, IL",
        listedAt: "2025-11-01",
        transmission: "Automatic",
        available: true,
        image:
          "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1200&auto=format&fit=crop",
        shortDescription:
          "Maximum payload for industrial freight and long haul routes.",
        detailedDescription:
          "The Volvo FH16 Heavy Cargo Truck is engineered for demanding logistics operations. With a reinforced chassis and 26-ton payload capacity, it handles construction materials, steel coils, and palletized industrial goods with ease. The sleeper cab supports multi-day routes, while advanced braking and stability systems keep heavy loads secure on highways and job sites.",
        features: [
          "26-ton payload capacity",
          "Sleeper cab for long routes",
          "ABS and stability control",
          "Air suspension",
        ],
      }),
      withCategory("heavy-duty", "Heavy Duty", {
        id: "flatbed-hauler",
        name: "Flatbed Hauler",
        brand: "Freightliner",
        model: "M2 106",
        pricePerDay: 110,
        capacity: "18,000 kg",
        capacityKg: 18000,
        location: "Houston, TX",
        listedAt: "2025-10-15",
        transmission: "Manual",
        available: true,
        image:
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
        shortDescription:
          "Open deck for oversized equipment and building supplies.",
        detailedDescription:
          "The Freightliner M2 Flatbed Hauler offers an open platform for loads that won't fit in enclosed trailers. Perfect for lumber, steel beams, machinery, and prefab construction units. Tie-down points along the deck and optional side stakes make securing irregular cargo straightforward.",
        features: [
          "18-ton deck capacity",
          "Multiple tie-down points",
          "Side stake pockets",
          "City-friendly maneuverability",
        ],
      }),
    ],
  },
  {
    id: "light-commercial",
    name: "Light Commercial",
    description:
      "Efficient trucks for local deliveries, small business logistics, and everyday commercial use.",
    trucks: [
      withCategory("light-commercial", "Light Commercial", {
        id: "pickup-truck",
        name: "Pickup Truck",
        brand: "Ford",
        model: "F-150",
        pricePerDay: 80,
        capacity: "1,200 kg",
        capacityKg: 1200,
        location: "Denver, CO",
        listedAt: "2026-01-20",
        transmission: "Automatic",
        available: true,
        image:
          "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop",
        shortDescription:
          "Versatile pickup for quick local jobs and light cargo.",
        detailedDescription:
          "The Ford F-150 Pickup is the go-to choice for businesses that need flexibility without the size of a full commercial rig. The 1.2-ton bed handles tools, supplies, and small equipment for contractors, landscapers, and service technicians.",
        features: [
          "1.2-ton bed capacity",
          "Fuel-efficient V6 engine",
          "Optional 4WD",
          "Easy urban parking",
        ],
      }),
      withCategory("light-commercial", "Light Commercial", {
        id: "cargo-van",
        name: "Cargo Van",
        brand: "Mercedes",
        model: "Sprinter",
        pricePerDay: 90,
        capacity: "1,500 kg",
        capacityKg: 1500,
        location: "Los Angeles, CA",
        listedAt: "2026-02-05",
        transmission: "Automatic",
        available: false,
        image:
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop",
        shortDescription:
          "Enclosed van for secure parcel and equipment transport.",
        detailedDescription:
          "The Mercedes Sprinter Cargo Van protects goods from weather while maximizing interior volume. Shelving-ready walls and a low load floor simplify packing parcels, tools, and retail inventory for couriers and mobile service businesses.",
        features: [
          "Weather-sealed cargo bay",
          "High roof option",
          "Sliding side door",
          "Low load floor",
        ],
      }),
    ],
  },
  {
    id: "moving-delivery",
    name: "Moving & Delivery",
    description:
      "Trucks designed for furniture, retail goods, and residential or commercial moving projects.",
    trucks: [
      withCategory("moving-delivery", "Moving & Delivery", {
        id: "box-truck",
        name: "Box Truck",
        brand: "Isuzu",
        model: "NPR",
        pricePerDay: 100,
        capacity: "4,500 kg",
        capacityKg: 4500,
        location: "New York, NY",
        listedAt: "2025-12-10",
        transmission: "Manual",
        available: true,
        image:
          "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=1200&auto=format&fit=crop",
        shortDescription:
          "Enclosed box for furniture and protected merchandise.",
        detailedDescription:
          "The Isuzu NPR Box Truck is built for moving companies and retail distributors who need secure, weatherproof transport. The 4.5-ton box fits furniture sets, appliances, and palletized goods without exposure to rain or road debris.",
        features: [
          "4.5-ton box capacity",
          "Optional lift gate",
          "E-track interior rails",
          "Weatherproof enclosure",
        ],
      }),
      withCategory("moving-delivery", "Moving & Delivery", {
        id: "refrigerated-truck",
        name: "Refrigerated Truck",
        brand: "Hino",
        model: "268",
        pricePerDay: 130,
        capacity: "3,800 kg",
        capacityKg: 3800,
        location: "Miami, FL",
        listedAt: "2026-03-01",
        transmission: "Automatic",
        available: true,
        image:
          "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop",
        shortDescription:
          "Temperature-controlled transport for food and perishables.",
        detailedDescription:
          "The Hino 268 Refrigerated Truck maintains precise temperatures from -20°C to +15°C for food distributors, florists, and pharmaceutical couriers. Insulated walls and a high-efficiency refrigeration unit protect perishable cargo on multi-stop routes.",
        features: [
          "Adjustable temp range",
          "Insulated cargo box",
          "Digital temp monitoring",
          "Multi-stop ready",
        ],
      }),
    ],
  },
];

export function formatPrice(pricePerDay: number) {
  return `$${pricePerDay}/day`;
}

export const featuredTrucks: Truck[] = truckCategories.map(
  (category) => category.trucks[0]
);

export function getAllTrucks(): Truck[] {
  return truckCategories.flatMap((category) => category.trucks);
}

export function getTruckById(id: string): Truck | undefined {
  return getAllTrucks().find((truck) => truck.id === id);
}

export const truckTypeOptions = truckCategories.map((c) => ({
  id: c.id,
  name: c.name,
}));

export const transmissionOptions: Transmission[] = ["Manual", "Automatic"];

export function getTruckLocations(): string[] {
  return [...new Set(getAllTrucks().map((truck) => truck.location))].sort();
}
