import { getTrips } from "@/lib/actions";
import Navbar from "@/components/Navbar";
import TripsContent from "./TripsContent";

export default async function TripsPage() {
  const trips = await getTrips();
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <TripsContent trips={trips} />
        </div>
      </main>
    </>
  );
}
