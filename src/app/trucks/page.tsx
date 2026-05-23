import type { Metadata } from "next";

import { TrucksPageContent } from "@/components/trucks-page-content";

export const metadata: Metadata = {
  title: "Trucks — TruckRent",
  description:
    "Browse truck categories and detailed descriptions for every vehicle in our fleet.",
};

export default function TrucksPage() {
  return <TrucksPageContent />;
}
