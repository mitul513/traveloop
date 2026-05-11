import { getTrip } from "@/lib/actions";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import TripDetailContent from "./TripDetailContent";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);
  if (!trip) return notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <TripDetailContent trip={trip} />
        </div>
      </main>
    </>
  );
}
