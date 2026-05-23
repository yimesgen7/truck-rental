import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/booking-pricing";
import type { PaymentProvider } from "@/types/payment";

export async function markBookingPaid(
  bookingId: string,
  provider: PaymentProvider,
  externalId?: string
) {
  const invoiceNumber = generateInvoiceNumber();

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        invoiceNumber,
      },
    }),
    prisma.payment.update({
      where: { bookingId },
      data: {
        status: "PAID",
        provider,
        externalId,
      },
    }),
  ]);

  return invoiceNumber;
}
