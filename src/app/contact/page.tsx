import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Contact — TruckRent",
  description: "Get in touch with TruckRent for rentals, support, and inquiries.",
};

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    detail: "123 Fleet Street, Transport City, TC 10001",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+1 (800) 555-1234",
    href: "tel:+18005551234",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "support@truckrent.com",
    href: "mailto:support@truckrent.com",
  },
  {
    icon: Clock3,
    title: "Hours",
    detail: "Mon–Sat: 7am – 9pm · Sun: 9am – 6pm",
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-zinc-800 bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="font-semibold uppercase tracking-widest text-orange-500">
              Contact us
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              We&apos;re here to help
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Questions about rentals, fleet availability, or business accounts?
              Send us a message and our team will respond shortly.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold">Get in touch</h2>
              <p className="mt-3 text-zinc-400">
                Reach out by phone, email, or the form. We typically reply within
                one business day.
              </p>

              <ul className="mt-8 space-y-6">
                {contactInfo.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                      <item.icon className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 block text-zinc-400 transition hover:text-white"
                        >
                          {item.detail}
                        </a>
                      ) : (
                        <p className="mt-1 text-zinc-400">{item.detail}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 lg:col-span-3">
              <h2 className="text-2xl font-bold">Send a message</h2>
              <p className="mt-2 text-zinc-400">
                Fill out the form below and we&apos;ll be in touch.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
