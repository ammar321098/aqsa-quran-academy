import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import { ContactForm } from "@/app/(endusers)/_compoments/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <div className="overflow-x-hidden">
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-w-0">
          <AnimationWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary">
              Get In Touch
            </h2>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              
              {/* Contact Info Card */}
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-foreground">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <a
                    href="mailto:garish.engr405@gmail.com"
                    className="flex items-center gap-4 group min-w-0"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground group-hover:text-primary transition break-all min-w-0">
                      garish.engr405@gmail.com
                    </span>
                  </a>

                  <a
                    href="tel:+923224659062"
                    className="flex items-center gap-4 group min-w-0"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground group-hover:text-primary transition break-all min-w-0">
                      +92 322 465 9062
                    </span>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground">
                      Gujranwala, Punjab, Pakistan
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Form Card */}
              <ContactForm />

            </div>
          </AnimationWrapper>
        </div>
      </section>
    </div>
  )
}
