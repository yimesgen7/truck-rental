import { RequireAuthButton } from "@/components/require-auth-button";
import type { Truck } from "@/types/truck";

type TruckCardProps = {
  truck?: Truck;
  name: string;
  image: string;
  price: string;
  description: string;
};

export function TruckCard({
  truck,
  name,
  image,
  price,
  description,
}: TruckCardProps) {
  return (
    <article
      tabIndex={0}
      className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 focus-within:-translate-y-1 focus-within:border-orange-500/50 focus-within:shadow-xl focus-within:shadow-orange-500/10 focus-visible:outline-none"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-focus-within:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center p-6 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="text-center text-sm leading-relaxed text-zinc-200">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6 transition duration-300 group-hover:bg-zinc-900/80">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold transition group-hover:text-orange-500 group-focus-within:text-orange-500">
            {name}
          </h3>
          <p className="font-semibold text-orange-500">{price}</p>
        </div>

        <RequireAuthButton
          truck={truck}
          className="mt-6 w-full rounded-2xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-600"
        >
          Book Now
        </RequireAuthButton>
      </div>
    </article>
  );
}
