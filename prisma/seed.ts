/**
 * Full demo seed — admin + guests + Monal inventory + sample bookings.
 *
 * Admin: pradipbisht007@gmail.com / changeme
 * Guests: guest1@example.com / changeme123  (etc.)
 *
 * Run: npm run db:seed
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const ADMIN = {
  email: "pradipbisht007@gmail.com",
  password: "changeme",
  name: "Pradip Bisht",
};

const GUESTS = [
  { email: "guest1@example.com", name: "Ramesh Sharma", password: "changeme123" },
  { email: "guest2@example.com", name: "Sunita Gupta", password: "changeme123" },
  { email: "guest3@example.com", name: "Vikram Oberoi", password: "changeme123" },
  { email: "guest4@example.com", name: "Ananya Mehta", password: "changeme123" },
  { email: "guest5@example.com", name: "Col. S. Rathore", password: "changeme123" },
];

/** Grand Resort inventory (Gwaldam / Garhwal). */
const HOTEL_SEED = {
  name: "Grand Resort",
  city: "Gwaldam",
  country: "IN",
  address: "Gwaldam, Chamoli District, Garhwal Himalaya, Uttarakhand, India",
  description:
    "Nestled in the Garhwal Himalaya at Gwaldam — crisp alpine air, ridgeline views, 100% Pure Sattvik vegetarian dining, and refined hospitality for pilgrims and leisure travelers.",
  imageUrl:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85",
  rooms: [
    {
      name: "Presidential Mountain Peak Suite",
      description:
        "Crowning suite with panoramic Himalayan ridgelines, private deck, teak craftsmanship, and butler-ready service.",
      capacity: 4,
      priceCents: 2_200_000, // ₹22,000
    },
    {
      name: "Executive Himalayan Valley Suite",
      description:
        "Floor-to-ceiling valley views, marble en-suite, organic Pahadi tea service, all-weather comfort.",
      capacity: 4,
      priceCents: 1_500_000, // ₹15,000
    },
    {
      name: "Deluxe Pine Garden Suite",
      description:
        "Garden-level suite opening onto landscaped Himalayan flora, tea veranda, and mountain breeze.",
      capacity: 3,
      priceCents: 950_000, // ₹9,500
    },
    {
      name: "Standard Alpine Pilgrim Room",
      description:
        "Spotless cozy room for Yatra travelers — premium bedding, hot water, tranquil mountain air.",
      capacity: 2,
      priceCents: 650_000, // ₹6,500
    },
  ],
};

const SECOND_HOTEL = {
  name: "Grand Alpine Lodge",
  city: "Gwaldam",
  country: "IN",
  address: "Upper Gwaldam Ridge Trail, Uttarakhand",
  description:
    "Boutique sister lodge above the village — quieter nights, sunrise peaks, ideal for longer Himalayan stays.",
  imageUrl:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
  rooms: [
    {
      name: "Ridge View Cabin",
      description: "Wooden cabin with east-facing sunrise balcony.",
      capacity: 2,
      priceCents: 780_000,
    },
    {
      name: "Family Alpine Loft",
      description: "Two-level loft for families, valley light all day.",
      capacity: 5,
      priceCents: 1_100_000,
    },
    {
      name: "Trail Rest Room",
      description: "Simple clean room for trekkers — hot water & mountain quiet.",
      capacity: 2,
      priceCents: 480_000,
    },
  ],
};

const THIRD_HOTEL = {
  name: "Grand Riverside Rest",
  city: "Rudraprayag",
  country: "IN",
  address: "Alaknanda corridor approach, Rudraprayag, Uttarakhand",
  description:
    "Gateway stop near the sacred confluence — convenient for Yatra transit, Sattvik meals, and river views before the high passes.",
  imageUrl:
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85",
  rooms: [
    {
      name: "River View Deluxe",
      description: "Balcony facing the Alaknanda approach valleys.",
      capacity: 3,
      priceCents: 9_200_00,
    },
    {
      name: "Pilgrim Twin",
      description: "Twin beds, early breakfast window for Yatra departures.",
      capacity: 2,
      priceCents: 5_800_00,
    },
  ],
};

async function upsertCredentialUser(opts: {
  email: string;
  name: string;
  password: string;
  role: "ADMIN" | "USER";
}) {
  const passwordHash = await hashPassword(opts.password);
  const existing = await prisma.user.findUnique({
    where: { email: opts.email },
    include: { accounts: true },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: opts.name,
        role: opts.role,
        emailVerified: true,
      },
    });
    const cred = existing.accounts.find((a) => a.providerId === "credential");
    if (cred) {
      await prisma.account.update({
        where: { id: cred.id },
        data: { password: passwordHash },
      });
    } else {
      await prisma.account.create({
        data: {
          accountId: existing.id,
          providerId: "credential",
          userId: existing.id,
          password: passwordHash,
        },
      });
    }
    return existing.id;
  }

  const user = await prisma.user.create({
    data: {
      name: opts.name,
      email: opts.email,
      emailVerified: true,
      role: opts.role,
      accounts: {
        create: {
          accountId: "pending",
          providerId: "credential",
          password: passwordHash,
        },
      },
    },
  });
  await prisma.account.updateMany({
    where: { userId: user.id, providerId: "credential" },
    data: { accountId: user.id },
  });
  return user.id;
}

async function seedHotel(
  data: typeof HOTEL_SEED,
): Promise<{ hotelId: string; roomIds: string[] }> {
  // Soft-clear prior demo hotel with same name+city (rooms cascade)
  const old = await prisma.hotel.findFirst({
    where: { name: data.name, city: data.city },
  });
  if (old) {
    await prisma.booking.deleteMany({
      where: { room: { hotelId: old.id } },
    });
    await prisma.hotel.delete({ where: { id: old.id } });
  }

  const hotel = await prisma.hotel.create({
    data: {
      name: data.name,
      city: data.city,
      country: data.country,
      address: data.address,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: true,
      rooms: {
        create: data.rooms.map((r) => ({
          name: r.name,
          description: r.description,
          capacity: r.capacity,
          priceCents: r.priceCents,
          currency: "INR",
          isActive: true,
        })),
      },
    },
    include: { rooms: true },
  });

  return {
    hotelId: hotel.id,
    roomIds: hotel.rooms.map((r) => r.id),
  };
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL missing");
  }

  console.log("→ Admin…");
  const adminId = await upsertCredentialUser({
    ...ADMIN,
    role: "ADMIN",
  });
  console.log("  ", ADMIN.email, adminId);

  console.log("→ Guests…");
  const guestIds: string[] = [];
  for (const g of GUESTS) {
    const id = await upsertCredentialUser({ ...g, role: "USER" });
    guestIds.push(id);
    console.log("  ", g.email, id);
  }

  console.log("→ Hotels & rooms…");
  const monal = await seedHotel(HOTEL_SEED);
  const lodge = await seedHotel(SECOND_HOTEL);
  const riverside = await seedHotel(THIRD_HOTEL);
  console.log("  Grand rooms:", monal.roomIds.length);
  console.log("  Lodge rooms:", lodge.roomIds.length);
  console.log("  Riverside rooms:", riverside.roomIds.length);

  console.log("→ Sample bookings…");
  await prisma.booking.deleteMany({
    where: { userId: { in: guestIds } },
  });

  const samples: {
    userId: string;
    roomId: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalCents: number;
    status: "CONFIRMED" | "PENDING" | "CANCELLED";
    notes: string | null;
  }[] = [
    {
      userId: guestIds[0],
      roomId: monal.roomIds[0],
      checkIn: daysFromNow(7),
      checkOut: daysFromNow(10),
      guests: 2,
      totalCents: 3 * 2_200_000,
      status: "CONFIRMED",
      notes: "Early Yatra breakfast requested",
    },
    {
      userId: guestIds[1],
      roomId: monal.roomIds[2],
      checkIn: daysFromNow(14),
      checkOut: daysFromNow(16),
      guests: 2,
      totalCents: 2 * 950_000,
      status: "CONFIRMED",
      notes: null,
    },
    {
      userId: guestIds[2],
      roomId: lodge.roomIds[0],
      checkIn: daysFromNow(3),
      checkOut: daysFromNow(5),
      guests: 2,
      totalCents: 2 * 780_000,
      status: "PENDING",
      notes: "Sunrise trek interest",
    },
    {
      userId: guestIds[3],
      roomId: monal.roomIds[3],
      checkIn: daysFromNow(5),
      checkOut: daysFromNow(7),
      guests: 1,
      totalCents: 2 * 650_000,
      status: "CONFIRMED",
      notes: "Solo pilgrim",
    },
    {
      userId: guestIds[4],
      roomId: riverside.roomIds[0],
      checkIn: daysFromNow(9),
      checkOut: daysFromNow(11),
      guests: 2,
      totalCents: 2 * 920_000,
      status: "CONFIRMED",
      notes: "Transit before Phata heli",
    },
    {
      userId: guestIds[0],
      roomId: lodge.roomIds[1],
      checkIn: daysFromNow(20),
      checkOut: daysFromNow(23),
      guests: 4,
      totalCents: 3 * 1_100_000,
      status: "CANCELLED",
      notes: "Plans changed",
    },
  ];

  for (const b of samples) {
    await prisma.booking.create({
      data: {
        userId: b.userId,
        roomId: b.roomId,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        guests: b.guests,
        totalCents: b.totalCents,
        currency: "INR",
        status: b.status,
        notes: b.notes,
      },
    });
  }
  console.log("  Bookings:", samples.length);

  console.log("\n✅ Seed complete");
  console.log("Admin:", ADMIN.email, "/", ADMIN.password);
  console.log("Guest:", GUESTS[0].email, "/", GUESTS[0].password);
  console.log("Open /hotels and /admin");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
