import HeroSection from "@/components/HeroSection";
import Highlights from "@/components/Highlights";
import FeatureCourses from "@/components/FeatureCourses";
import VisionMission from "@/components/VisionMission";
import { getRecentLearningItems } from "@/app/data/learning/get-recent-learning";
import { getSuccessStats } from "@/app/data/home/get-success-stats";
// import FeaturedLearners from "@/components/FeaturedLearners";
import Testimonials from "@/components/Testimonials";
import StaffCarousel from "@/components/StaffCrousel";
import ContactSection from "@/components/ContactSection";
import SuccessStatics from "@/components/SuccessStatics";

// Revalidate every 60s - reduces DB load; homepage stats don't need real-time updates
export const revalidate = 60;

export default async function AqsaQuranAcademyLanding() {
  const [recentLearning, successStats] = await Promise.all([
    getRecentLearningItems(4),
    getSuccessStats(),
  ]);

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <HeroSection />
      <Highlights />
      <FeatureCourses items={recentLearning} />
      <VisionMission />
      <SuccessStatics stats={successStats} />
      {/* <FeaturedLearners /> */}
      <StaffCarousel />
      <Testimonials />
      <ContactSection />
    </div>
  );
}
