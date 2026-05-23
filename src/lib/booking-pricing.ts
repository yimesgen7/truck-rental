const DRIVER_FEE_PER_DAY = 50;

export function rentalDays(startDate: Date, endDate: Date) {
  const ms = endDate.getTime() - startDate.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function calculateBookingTotal(
  pricePerDay: number,
  startDate: Date,
  endDate: Date,
  driverOption: "self" | "with-driver"
) {
  const days = rentalDays(startDate, endDate);
  const base = pricePerDay * days;
  const driverFee =
    driverOption === "with-driver" ? DRIVER_FEE_PER_DAY * days : 0;
  return {
    days,
    base,
    driverFee,
    total: base + driverFee,
  };
}

export function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${year}-${suffix}`;
}
