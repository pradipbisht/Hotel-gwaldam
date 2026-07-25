import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { CreateBookingForm } from "@/components/bookings/create-booking-form";
import { AUTH_ROUTES } from "@/lib/auth/constant";

type Props = { searchParams: Promise<{ roomId?: string }> };

export default async function NewBookingPage({ searchParams }: Props) {
  const { roomId } = await searchParams;
  if (!roomId) {
    return (
      <div className="min-h-[60vh] px-4 py-20 text-center text-stone-600">
        <p>Missing room. Pick a room from a hotel page.</p>
        <Link href="/hotels" className="brand-btn-primary-light mt-4 inline-flex">
          Hotels
        </Link>
      </div>
    );
  }

  const room = await prisma.room.findFirst({
    where: { id: roomId, isActive: true, hotel: { isActive: true } },
    include: { hotel: true },
  });
  if (!room) notFound();

  return (
    <div className="min-h-[70vh] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <Link
            href={`/hotels/${room.hotelId}`}
            className="text-sm text-stone-500 hover:text-amber-800"
          >
            ← {room.hotel.name}
          </Link>
          <h1 className="mt-3 font-serif text-2xl font-medium text-stone-900">
            Confirm reservation
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {room.hotel.city} · secure booking with your account
          </p>
        </div>
        <CreateBookingForm
          roomId={room.id}
          roomName={room.name}
          maxGuests={room.capacity}
          priceCents={room.priceCents}
        />
        <p className="text-center text-xs text-stone-500">
          Need an account?{" "}
          <Link href={AUTH_ROUTES.register} className="font-medium text-amber-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
