"use client";

import {
  ArrowRight,
  Clock3,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RequireAuthButton } from "@/components/require-auth-button";
import Link from "next/link";

import { TruckCard } from "@/components/truck-card";
import { featuredTrucks, formatPrice } from "@/lib/trucks-data";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Secure Rentals",
    description:
      "Trusted and verified truck rental services with safe booking.",
  },
  {
    icon: Clock3,
    title: "24/7 Availability",
    description:
      "Rent trucks anytime for moving, logistics, or transportation.",
  },
  {
    icon: MapPin,
    title: "Multiple Locations",
    description:
      "Access truck rental services from various pickup locations.",
  },
];

const featureCardClass =
  "group rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:bg-zinc-900/90 hover:shadow-xl hover:shadow-orange-500/10 focus-within:-translate-y-1 focus-within:border-orange-500/50 focus-within:shadow-xl focus-within:shadow-orange-500/10";

export function HomeContent() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-10 bg-linear-to-r from-black via-black/80 to-transparent" />

        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1600&auto=format&fit=crop"
          alt="Truck"
          className="h-[700px] w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <p className="mb-4 font-semibold uppercase tracking-widest text-orange-500">
                Reliable Truck Rental Service
              </p>

              <h1 className="text-5xl font-bold leading-tight md:text-7xl">
                Rent Trucks For Your Business Anytime
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-zinc-300">
                Find affordable and reliable trucks for logistics,
                transportation, moving, and delivery services.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/trucks"
                  className="flex items-center gap-2 rounded-2xl bg-orange-500 px-7 py-4 font-semibold transition hover:bg-orange-600"
                >
                  Browse Trucks
                  <ArrowRight size={18} />
                </Link>

                <button
                  type="button"
                  className="rounded-2xl border border-zinc-700 bg-zinc-900/40 px-7 py-4 font-semibold transition hover:bg-zinc-800"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              tabIndex={0}
              className={featureCardClass}
            >
              <feature.icon
                className="mb-4 text-orange-500 transition duration-300 group-hover:scale-110 group-focus-within:scale-110"
                size={36}
              />
              <h3 className="text-2xl font-bold transition duration-300 group-hover:text-orange-500 group-focus-within:text-orange-500">
                {feature.title}
              </h3>
              <p className="mt-3 text-zinc-400 transition duration-300 group-hover:text-zinc-300 group-focus-within:text-zinc-300">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="trucks" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="font-semibold uppercase tracking-wider text-orange-500">
              Popular Trucks
            </p>
            <h2 className="mt-2 text-4xl font-bold">Explore Available Trucks</h2>
          </div>

          <Link
            href="/trucks"
            className="hidden rounded-xl border border-zinc-700 px-5 py-3 font-semibold transition hover:bg-zinc-900 md:block"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredTrucks.map((truck) => (
            <TruckCard
              key={truck.id}
              truck={truck}
              name={truck.name}
              image={truck.image}
              price={formatPrice(truck.pricePerDay)}
              description={truck.shortDescription}
            />
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-20 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-4xl font-bold">Ready to rent your truck?</h2>

            <p className="mt-4 max-w-xl text-zinc-400">
              Start booking reliable trucks for your transportation needs today.
            </p>
          </div>

          <RequireAuthButton className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold transition hover:bg-orange-600">
            Get Started
          </RequireAuthButton>
        </div>
      </section>

      <Footer />
    </div>
  );
}
