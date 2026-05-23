import Link from "next/link";
import { Mail, MapPin, Phone, Truck } from "lucide-react";

import { navLinks } from "@/lib/nav-links";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <Truck className="text-orange-500" />
              TruckRent
            </Link>
            <p className="mt-4 max-w-sm text-zinc-400">
              Reliable truck rentals for logistics, moving, and business
              transportation. Book the right truck when you need it.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-orange-500">Quick links</h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-zinc-400 transition hover:text-white"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-zinc-400 transition hover:text-white"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-orange-500">Contact</h3>
            <ul className="mt-4 space-y-3 text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-orange-500" size={18} />
                <span>123 Fleet Street, Transport City, TC 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-orange-500" size={18} />
                <a href="tel:+18005551234" className="transition hover:text-white">
                  +1 (800) 555-1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-orange-500" size={18} />
                <a
                  href="mailto:support@truckrent.com"
                  className="transition hover:text-white"
                >
                  support@truckrent.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500 sm:text-left">
          © {year} TruckRent. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
