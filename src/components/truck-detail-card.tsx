import { RequireAuthButton } from "@/components/require-auth-button";
import { formatPrice } from "@/lib/trucks-data";
import type { Truck } from "@/types/truck";

export function TruckDetailCard({ truck }: { truck: Truck }) {
  return (
    <article
      id={truck.id}
      tabIndex={0}
      className="group scroll-mt-28 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 focus-within:-translate-y-1 focus-within:border-orange-500/50 focus-visible:outline-none"
    >
      <div className="relative h-56 overflow-hidden sm:h-64">
        <img
          src={truck.image}
          alt={truck.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-focus-within:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center p-6 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="text-center text-sm leading-relaxed text-zinc-200">
            {truck.shortDescription}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold transition group-hover:text-orange-500">
              {truck.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {truck.brand} {truck.model}
            </p>
          </div>
          <p className="text-lg font-semibold text-orange-500">
            {formatPrice(truck.pricePerDay)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
            {truck.location}
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
            {truck.categoryName}
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
            {truck.capacity}
          </span>
          <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
            {truck.transmission}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs ${
              truck.available
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {truck.available ? "Available" : "Booked"}
          </span>
        </div>

        <p className="mt-5 leading-relaxed text-zinc-400">
          {truck.detailedDescription}
        </p>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {truck.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-zinc-300"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-orange-500" />
              {feature}
            </li>
          ))}
        </ul>

        <RequireAuthButton
          truck={truck}
          className="mt-6 w-full rounded-2xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-600"
        >
          Book {truck.name}
        </RequireAuthButton>
      </div>
    </article>
  );
}
