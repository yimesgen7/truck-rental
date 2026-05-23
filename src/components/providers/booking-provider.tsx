"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { BookingModal } from "@/components/booking-modal";
import type { Truck } from "@/types/truck";

type BookingContextValue = {
  openBooking: (truck?: Truck) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | undefined>();

  const openBooking = useCallback((truck?: Truck) => {
    setSelectedTruck(truck);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openBooking, closeBooking }),
    [openBooking, closeBooking]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal
        open={open}
        onOpenChange={setOpen}
        truck={selectedTruck}
      />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}
