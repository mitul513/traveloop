"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

// ─── USER ───────────────────────────────────────────
export async function getOrCreateUser() {
  const existing = await prisma.user.findFirst();
  if (existing) return existing;
  return prisma.user.create({
    data: {
      email: "traveler@traveloop.dev",
      name: "Explorer",
    },
  });
}

// ─── TRIPS ──────────────────────────────────────────
export async function getTrips() {
  const user = await getOrCreateUser();
  return prisma.trip.findMany({
    where: { userId: user.id },
    include: {
      stops: { include: { activities: true }, orderBy: { orderIndex: "asc" } },
      checklists: true,
      notes: true,
    },
    orderBy: { startDate: "desc" },
  });
}

export async function getTrip(id: string) {
  return prisma.trip.findUnique({
    where: { id },
    include: {
      stops: {
        include: { activities: true, notes: true },
        orderBy: { orderIndex: "asc" },
      },
      checklists: true,
      notes: { orderBy: { timestamp: "desc" } },
    },
  });
}

export async function createTrip(formData: FormData) {
  const user = await getOrCreateUser();
  const name = formData.get("name") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const description = (formData.get("description") as string) || "";

  await prisma.trip.create({
    data: {
      userId: user.id,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
    },
  });
  revalidatePath("/");
  revalidatePath("/trips");
}

export async function deleteTrip(id: string) {
  await prisma.trip.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/trips");
}

// ─── STOPS ──────────────────────────────────────────
export async function addStop(formData: FormData) {
  const tripId = formData.get("tripId") as string;
  const cityName = formData.get("cityName") as string;
  const country = formData.get("country") as string;
  const arrival = formData.get("arrival") as string;
  const departure = formData.get("departure") as string;

  const count = await prisma.stop.count({ where: { tripId } });

  await prisma.stop.create({
    data: {
      tripId,
      cityName,
      country,
      arrival: new Date(arrival),
      departure: new Date(departure),
      orderIndex: count,
    },
  });
  revalidatePath(`/trips/${tripId}`);
}

export async function deleteStop(id: string, tripId: string) {
  await prisma.stop.delete({ where: { id } });
  revalidatePath(`/trips/${tripId}`);
}

export async function reorderStops(tripId: string, stopIds: string[]) {
  await Promise.all(
    stopIds.map((id, index) =>
      prisma.stop.update({ where: { id }, data: { orderIndex: index } })
    )
  );
  revalidatePath(`/trips/${tripId}`);
}

// ─── ACTIVITIES ─────────────────────────────────────
export async function addActivity(formData: FormData) {
  const stopId = formData.get("stopId") as string;
  const tripId = formData.get("tripId") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const cost = parseFloat((formData.get("cost") as string) || "0");
  const duration = parseInt((formData.get("duration") as string) || "60");

  await prisma.activity.create({
    data: { stopId, name, category, cost, duration },
  });
  revalidatePath(`/trips/${tripId}`);
}

export async function deleteActivity(id: string, tripId: string) {
  await prisma.activity.delete({ where: { id } });
  revalidatePath(`/trips/${tripId}`);
}

// ─── CHECKLIST ──────────────────────────────────────
export async function addChecklistItem(formData: FormData) {
  const tripId = formData.get("tripId") as string;
  const itemName = formData.get("itemName") as string;
  const category = formData.get("category") as string;

  await prisma.checklistItem.create({
    data: { tripId, itemName, category },
  });
  revalidatePath(`/trips/${tripId}`);
}

export async function toggleChecklistItem(id: string, tripId: string) {
  const item = await prisma.checklistItem.findUnique({ where: { id } });
  if (item) {
    await prisma.checklistItem.update({
      where: { id },
      data: { isPacked: !item.isPacked },
    });
  }
  revalidatePath(`/trips/${tripId}`);
}

export async function deleteChecklistItem(id: string, tripId: string) {
  await prisma.checklistItem.delete({ where: { id } });
  revalidatePath(`/trips/${tripId}`);
}

// ─── NOTES ──────────────────────────────────────────
export async function addNote(formData: FormData) {
  const tripId = formData.get("tripId") as string;
  const stopId = (formData.get("stopId") as string) || null;
  const content = formData.get("content") as string;

  await prisma.note.create({
    data: { tripId, stopId, content },
  });
  revalidatePath(`/trips/${tripId}`);
}

export async function deleteNote(id: string, tripId: string) {
  await prisma.note.delete({ where: { id } });
  revalidatePath(`/trips/${tripId}`);
}
