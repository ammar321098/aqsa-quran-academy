"use client";

import AnimationWrapper from "@/app/(endusers)/_compoments/AnimationWraper";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

type StaffMember = {
  name: string;
  role: string;
  photo: string;
  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
};

const staffData: StaffMember[] = [
  {
    name: "Aisha Khan",
    role: "Instructor",
    photo: "/avatar.jpeg",
    socials: { facebook: "#", twitter: "#", linkedin: "#" },
  },
  {
    name: "Ali Raza",
    role: "Course Coordinator",
    photo: "/avatar.jpeg",
    socials: { twitter: "#", instagram: "#" },
  },
  {
    name: "Sara Ahmed",
    role: "Designer",
    photo: "/avatar.jpeg",
    socials: { linkedin: "#", instagram: "#" },
  },
];

export default function StaffSection() {
  return (
    <section className="pb-20 bg-muted-foreground/20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <AnimationWrapper>
          <h3 className="text-3xl font-bold text-center text-primary mb-12">
            Meet Our Staff
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {staffData.map((staff) => (
              <div
                key={staff.name}
                className="bg-gray-200 dark:bg-muted-foreground/30 p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <img
                  src={staff.photo}
                  alt={staff.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-primary"
                />
                <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">
                  {staff.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-300">{staff.role}</p>
                <div className="flex justify-center space-x-4 mt-3 text-lg text-primary">
                  {staff.socials.facebook && (
                    <a href={staff.socials.facebook} target="_blank">
                      <FaFacebookF />
                    </a>
                  )}
                  {staff.socials.twitter && (
                    <a href={staff.socials.twitter} target="_blank">
                      <FaTwitter />
                    </a>
                  )}
                  {staff.socials.linkedin && (
                    <a href={staff.socials.linkedin} target="_blank">
                      <FaLinkedinIn />
                    </a>
                  )}
                  {staff.socials.instagram && (
                    <a href={staff.socials.instagram} target="_blank">
                      <FaInstagram />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}
