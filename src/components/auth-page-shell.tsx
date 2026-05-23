import Link from "next/link";
import { Truck } from "lucide-react";

export function AuthPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <header className="border-b border-zinc-800 px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Truck className="text-orange-500" />
          TruckRent
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-zinc-400">{subtitle}</p>
          <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
