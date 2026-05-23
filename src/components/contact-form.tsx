"use client";

import { FormEvent, useState } from "react";

import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 text-center">
        <p className="text-lg font-semibold text-white">Message sent!</p>
        <p className="mt-2 text-zinc-400">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-semibold text-orange-500 hover:text-orange-400"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-zinc-300">
            Name
          </label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 border-zinc-700 bg-zinc-950 text-white"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-zinc-700 bg-zinc-950 text-white"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-zinc-300">
          Subject
        </label>
        <Input
          id="subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-11 border-zinc-700 bg-zinc-950 text-white"
          placeholder="How can we help?"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-zinc-300">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Tell us about your rental needs..."
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-orange-500 py-3 font-semibold transition hover:bg-orange-600"
      >
        Send message
      </button>
    </form>
  );
}
