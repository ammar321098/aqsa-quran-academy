"use client";

import Image from "next/image";

// Images: add f (1).png, f (2).png, ... f (9).png to the public folder.
// If using f1.png, f2.png naming, update the image paths below.
const features: { title: string; titleHighlight: string; description: string; image: string }[] = [
  {
    title: "Smart",
    titleHighlight: "Course Management",
    description:
      "Admins create and manage courses through a powerful dashboard. Organize content into chapters and lessons, upload video content directly to cloud storage or embed YouTube links, set course metadata (title, description, price, duration, level, category), and publish when ready. The course structure supports multiple chapters per course and multiple lessons per chapter, with flexible video sources—either uploaded files or embedded URLs—so instructors can deliver Quran and Arabic education in the format that works best for each topic.",
    image: "/f (1).png",
  },
  {
    title: "Teacher-",
    titleHighlight: "Friendly Dashboard",
    description:
      "Teachers access a dedicated dashboard showing all assigned classes. From a single view, they can open any class to see enrolled students, post announcements, share documents and video links, create quiz posts linked to Google Forms or in-app quizzes, and mark daily attendance. The teacher results page lets instructors select a classroom and quiz to view all student submissions and performance. Quizzes can be created for courses, chapters, or classrooms—giving teachers full control over assessment within their teaching scope.",
    image: "/f (2).png",
  },
  {
    title: "Student",
    titleHighlight: "Learning Portal",
    description:
      "Students use a focused dashboard to see all enrolled courses and classes. The attendance overview displays a summary of attendance across enrolled classes at a glance. From the Learning page, students can browse courses, live classes, and standalone quizzes with search and filters by type and level. Once enrolled, they access course content lesson by lesson—watching embedded or uploaded videos and marking lessons complete. Classroom members view a shared stream of announcements, documents, videos, and quizzes posted by their teacher. Students can also view their quiz results and attendance records.",
    image: "/f (3).png",
  },
  {
    title: "Attendance &",
    titleHighlight: "Progress Tracking",
    description:
      "Teachers mark attendance per class per day: each student is recorded as Present, Absent, or Leave using a date picker and class selector. Students see an attendance overview with a visual summary across all enrolled classes. Lesson progress is tracked automatically: when a student completes a lesson, it is marked complete and stored in the database. This enables both teachers and students to monitor engagement and progress over time, with attendance history available for reporting and parent communication.",
    image: "/f (4).png",
  },
  {
    title: "Announcements &",
    titleHighlight: "Notifications",
    description:
      "Teachers post to the class stream with multiple content types: announcements (title and text), document links, video links, and quiz links. Each post appears in the classroom view for all approved students. When posting a quiz, teachers can attach a Google Form URL or link to an in-app quiz, making it easy to share assessments and resources in one place. Students see posts in chronological order with clear labels for document, video, and quiz types, so important updates and materials are always easy to find.",
    image: "/f (5).png",
  },
  {
    title: "Quizzes &",
    titleHighlight: "Assessments",
    description:
      "The platform supports multiple quiz types: in-app quizzes with single choice, multiple choice, short text, and long text questions—all creatable by admins and teachers—plus Google Form quizzes for external assessments. Quizzes can be attached to courses (course-level), chapters (chapter-level), classrooms (class posts), or published as standalone quizzes. In-app quizzes use auto-grading for choice questions and manual grading for text answers, with a dedicated grading interface for teachers. Students attempt quizzes from their dashboard or classroom, and results are stored for both instructors and learners to view.",
    image: "/f (6).png",
  },
  {
    title: "Reports &",
    titleHighlight: "Analytics",
    description:
      "Admins see dashboard statistics including signups, enrolled customers, courses, and lessons. Teachers view quiz results by selecting a classroom and quiz, then seeing a list of students with their marks. Students access their own results page showing performance across attempted quizzes. Attendance data is aggregated per class and per student, supporting attendance summaries and reports. Together these views give clear insights into enrollment, engagement, and academic performance across the academy.",
    image: "/f (7).png",
  },
  {
    title: "Secure &",
    titleHighlight: "Role-Based Access",
    description:
      "The app enforces strict role-based access: admins manage courses, classes, categories, members, and system settings; teachers access only their assigned classes, quizzes, attendance, and results; students see only their enrolled content and personal data. Authentication is handled by Better Auth with support for email and OTP. Routes are protected with server-side checks—requireAdmin, requireTeacher, and requireStudent—so unauthorized users cannot access restricted pages. Each role has a dedicated layout and sidebar tailored to their needs.",
    image: "/f (8).png",
  },
  {
    title: "Unified Learning &",
    titleHighlight: "Responsive Design",
    description:
      "A single Learning page brings together courses, live classes, and quizzes. Students and guests can search by keyword and filter by type (courses, classes, quizzes) and level (Beginner, Intermediate, Advanced). The interface is built with responsive Tailwind CSS so it works on desktop, tablet, and mobile. Public course, class, and quiz pages are viewable without login; enrollment requires authentication. The layout adapts across screen sizes, keeping navigation, cards, and content readable and accessible on any device.",
    image: "/f (9).png",
  },
];

function FeatureCard({
  title,
  titleHighlight,
  description,
  image,
  index,
}: {
  title: string;
  titleHighlight: string;
  description: string;
  image: string;
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <div className="overflow-hidden">
      <div
        className={`flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-8 items-center ${
          isEven ? "" : "md:flex-row-reverse"
        }`}
      >
        <div className="relative w-full md:w-80 lg:w-96 shrink-0 aspect-square">
          <Image
            src={image}
            alt={`${title} ${titleHighlight}`}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 384px"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            {title} <span className="text-primary">{titleHighlight}</span>
          </h2>
          <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-16 md:mb-20">
            Explore <span className="text-primary">Features</span>
          </h1>

          <div className="flex flex-col">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                titleHighlight={feature.titleHighlight}
                description={feature.description}
                image={feature.image}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
