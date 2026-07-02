import HeroSection from "@/components/HeroSection";
import Highlights from "@/components/Highlights";
import { Suspense } from "react";
import AnimationWrapper from "./_compoments/AnimationWraper";
import VisionMission from "@/components/VisionMission";
import IndustryExperience from "@/components/IndustryExperience";
import Testimonials from "@/components/Testimonials";
import StaffCarousel from "@/components/StaffCrousel";
import ReviewCarousal from "@/components/ReviewsCrousal";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function AqsaQuranAcademyLanding() {
  return (
    <div className="w-full">
      {/* Header Section */}
      <HeroSection />
      {/* Highlights Section */}
      <Highlights />

      {/* Vision & Mission Section */}
      <VisionMission />
      {/* Industry Experience Section */}
      <IndustryExperience />
      {/* Testimonials Section */}
      <Testimonials />
      {/* Staff Section */}
      <StaffCarousel />
      {/* Review Crousel Section */}
      <ReviewCarousal />

      {/* Contact Form */}
      <section id="contact" className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimationWrapper>
            <h3 className="text-3xl font-bold text-center mb-12 text-primary">
              Get In Touch
            </h3>
            <form className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input className="border p-3 rounded-xl" placeholder="Name" />
                <input className="border p-3 rounded-xl" placeholder="Email" />
              </div>
              <textarea
                className="border p-3 rounded-xl"
                placeholder="Message"
                rows={4}
              />
              <Button className="w-50">Send Message</Button>
            </form>
          </AnimationWrapper>
        </div>
      </section>
    </div>
  );
}
