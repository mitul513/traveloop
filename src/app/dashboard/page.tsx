import { getTrips } from "@/lib/actions";
import Navbar from "@/components/Navbar";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const trips = await getTrips();
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <DashboardContent trips={trips} />
        </div>
      </main>
    </>
  );
}
