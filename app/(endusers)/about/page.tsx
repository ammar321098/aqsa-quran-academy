import { getSuccessStats } from "@/app/data/home/get-success-stats";
import AboutPageClient from "./_components/AboutPageClient";

export default async function AboutPage() {
  const stats = await getSuccessStats();

  return <AboutPageClient stats={stats} />;
}
