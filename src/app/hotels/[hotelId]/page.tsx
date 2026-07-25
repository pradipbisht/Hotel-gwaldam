import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, BedDouble, Users, ArrowLeft } from "lucide-react";
import { PublicShell } from "@/components/ux/public-shell";
import { CreateBookingForm } from "@/components/bookings/create-booking-form";
import { getPublicHotel } from "@/lib/actions/hotel";
import { getServerSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/security/permissions";
import { AUTH_ROUTES } from "@/lib/auth/constant";

type Props = { params: Promise<{ hotelId: string }> };

export default async function HotelDetailPage({ params }: Props) {
  const { hotelId } = await params;
  const hotel = await getPublicHotel(hotelId);
  if (!hotel) notFound();

  const session = await getServerSession();
  const showAdminLink = isAdmin(session?.user?.role as string | undefined);
  const userLabel = session?.user?.name || session?.user?.email || null;

  return (
    <PublicShell showAdminLink={showAdminLink} userLabel={userLabel}>
      <div className="min-h-screen bg-stone-50 pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-amber-800"
          >
            <ArrowLeft className="h-4 w-4" />
            All hotels
          </Link>

          <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="relative h-56 bg-stone-200 sm:h-72">
              {hotel.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
                <MapPin className="h-3.5 w-3.5" />
                {hotel.city}
                {hotel.country ? `, ${hotel.country}` : null}
              </p>
              <h1 className="mt-2 font-serif text-3xl font-medium text-stone-900">
                {hotel.name}
              </h1>
              {hotel.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
                  {hotel.description}
                </p>
              ) : null}
              {hotel.address ? (
                <p className="mt-2 text-xs text-stone-400">{hotel.address}</p>
              ) : null}
            </div>
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-stone-900">
              Rooms & booking
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Choose a tier and confirm dates — updates without a full page
              reload.
            </p>

            {hotel.rooms.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-10 text-center text-sm text-stone-500">
                No active rooms yet.
              </p>
            ) : (
              <ul className="mt-6 space-y-6">
                {hotel.rooms.map((room) => (
                  <li
                    key={room.id}
                    className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm lg:grid-cols-2 lg:p-5"
                  >
                    <div>
                      <p className="font-medium text-stone-900">{room.name}</p>
                      {room.description ? (
                        <p className="mt-1 text-sm text-stone-500">
                          {room.description}
                        </p>
                      ) : null}
                      <p className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-amber-700" />
                          Up to {room.capacity}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-900">
                          <BedDouble className="h-3.5 w-3.5 text-amber-700" />
                          ₹{(room.priceCents / 100).toLocaleString("en-IN")} /
                          night
                        </span>
                      </p>
                    </div>
                    <div>
                      {session ? (
                        <CreateBookingForm
                          roomId={room.id}
                          roomName={room.name}
                          maxGuests={room.capacity}
                          priceCents={room.priceCents}
                        />
                      ) : (
                        <div className="flex h-full flex-col justify-center rounded-2xl border border-stone-200 bg-stone-50 p-4">
                          <p className="text-sm text-stone-600">
                            Sign in to reserve this room with live availability
                            checks.
                          </p>
                          <Link
                            href={`${AUTH_ROUTES.login}?next=${encodeURIComponent(`/hotels/${hotel.id}`)}`}
                            className="brand-btn-primary-light mt-4 !text-xs"
                          >
                            Sign in to book
                          </Link>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
