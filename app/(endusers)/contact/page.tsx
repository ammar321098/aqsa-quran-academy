import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/8 rounded-full blur-3xl" />
        </div>
        <AnimationWrapper>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary/80 mb-3">
              We&apos;re Here to Help
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Have questions about enrollment, courses, or our programs? Reach out and we&apos;ll
              respond within 24–48 hours. We&apos;re here to support your Quran learning journey.
            </p>
          </div>
        </AnimationWrapper>
      </section>

      {/* Location Map */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <AnimationWrapper>
            <div className="text-center mb-10">
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary/80 mb-2">
                Find Us
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Our Location
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Aqsa Quran Academy is based in Lahore, Punjab—serving students worldwide through online classes.
              </p>
            </div>
          </AnimationWrapper>
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm aspect-video bg-muted min-h-[280px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3379.627569943471!2d74.19261418794757!3d32.10634984333194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f2a9303c7bbe3%3A0xb570f654b5f5f754!2sJamia%20Masjid%20Aqsa!5e0!3m2!1sen!2s!4v1771492930358!5m2!1sen!2s" 
            width="600" 
            height="450" 
            className="w-full h-full min-h-[280px] border-0" 
            loading="lazy"
          ></iframe>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
