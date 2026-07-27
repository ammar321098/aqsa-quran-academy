import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED = {
  departmentCodes: ["QS", "IS"] as const,
  courseSlugs: ["quran-tajweed-basics", "quran-memorization-hifz", "arabic-for-quran"] as const,
  classroomSlugs: ["evening-tajweed-class", "weekend-hifz-circle"] as const,
  standaloneQuizSlug: "general-quran-knowledge",
};

async function resolveUsers() {
  const users = await prisma.user.findMany({
    include: {
      studentProfile: true,
      teacherProfile: true,
    },
  });

  if (users.length === 0) {
    throw new Error(
      "No users found in the database. Create users first (signup/login), then run: npm run seed"
    );
  }

  const admin =
    users.find((u) => u.role === "admin") ??
    users.find((u) => u.email?.includes("admin")) ??
    users[0];

  const teacher =
    users.find((u) => u.isTeacher && u.teacherProfile) ??
    users.find((u) => u.isTeacher) ??
    users.find((u) => u.role === "teacher") ??
    admin;

  const students = users.filter(
    (u) => u.isStudent || u.role === "student" || u.studentProfile
  );

  const student = students[0] ?? users.find((u) => u.id !== admin.id) ?? admin;
  const student2 =
    students[1] ?? users.find((u) => u.id !== admin.id && u.id !== student.id) ?? student;

  return { admin, teacher, student, student2, users };
}

async function seedDepartments() {
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: "QS" },
      update: { name: "Quran Sciences" },
      create: { name: "Quran Sciences", code: "QS" },
    }),
    prisma.department.upsert({
      where: { code: "IS" },
      update: { name: "Islamic Studies" },
      create: { name: "Islamic Studies", code: "IS" },
    }),
  ]);

  console.log(`✓ Departments: ${departments.length}`);
  return { qs: departments[0], is: departments[1] };
}

async function seedCourseCategories() {
  const names = ["Tajweed", "Hifz", "Arabic"];
  for (const name of names) {
    await prisma.courseCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✓ Course categories: ${names.length}`);
}

async function seedProfiles(
  teacher: Awaited<ReturnType<typeof resolveUsers>>["teacher"],
  student: Awaited<ReturnType<typeof resolveUsers>>["student"],
  student2: Awaited<ReturnType<typeof resolveUsers>>["student2"]
) {
  await prisma.teacherProfile.upsert({
    where: { userId: teacher.id },
    update: {
      fullName: teacher.name ?? "Ustad Ahmed Ali",
      verified: true,
    },
    create: {
      userId: teacher.id,
      fullName: teacher.name ?? "Ustad Ahmed Ali",
      cnic: `35202-${teacher.id.slice(0, 7)}-1`,
      phone: "+92-302-5555555",
      address: "Islamabad, Pakistan",
      verified: true,
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {
      fullName: student.name ?? "Fatima Khan",
      verified: true,
    },
    create: {
      userId: student.id,
      fullName: student.name ?? "Fatima Khan",
      cnic: `35202-${student.id.slice(0, 7)}-2`,
      phone: "+92-300-1234567",
      address: "Lahore, Pakistan",
      verified: true,
    },
  });

  if (student2.id !== student.id) {
    await prisma.studentProfile.upsert({
      where: { userId: student2.id },
      update: {
        fullName: student2.name ?? "Ali Hassan",
        verified: true,
      },
      create: {
        userId: student2.id,
        fullName: student2.name ?? "Ali Hassan",
        cnic: `35202-${student2.id.slice(0, 7)}-3`,
        phone: "+92-301-9876543",
        address: "Karachi, Pakistan",
        verified: true,
      },
    });
  }

  console.log("✓ Student & teacher profiles");
}

async function seedCourses(adminId: string) {
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { slug: SEED.courseSlugs[0] },
      update: {},
      create: {
        title: "Quran Tajweed Basics",
        description: "<p>Learn Tajweed rules from scratch with guided practice.</p>",
        fileKey: "seed/courses/tajweed.jpg",
        price: 0,
        duration: 12,
        level: "Beginner",
        category: "Tajweed",
        smallDescription: "Master Quran pronunciation rules.",
        slug: SEED.courseSlugs[0],
        status: "Published",
        isFree: true,
        isFeatured: true,
        userId: adminId,
      },
    }),
    prisma.course.upsert({
      where: { slug: SEED.courseSlugs[1] },
      update: {},
      create: {
        title: "Quran Memorization (Hifz)",
        description: "<p>Structured Hifz program with weekly targets.</p>",
        fileKey: "seed/courses/hifz.jpg",
        price: 15000,
        duration: 24,
        level: "Intermediate",
        category: "Hifz",
        smallDescription: "Memorize the Quran with a proven plan.",
        slug: SEED.courseSlugs[1],
        status: "Published",
        isFree: false,
        isFeatured: true,
        needsToWorkOn: "Revision schedule",
        userId: adminId,
      },
    }),
    prisma.course.upsert({
      where: { slug: SEED.courseSlugs[2] },
      update: {},
      create: {
        title: "Arabic for Quran",
        description: "<p>Understand Quranic Arabic vocabulary and grammar.</p>",
        fileKey: "seed/courses/arabic.jpg",
        price: 8000,
        duration: 16,
        level: "Advanced",
        category: "Arabic",
        smallDescription: "Read and understand Quranic Arabic.",
        slug: SEED.courseSlugs[2],
        status: "Draft",
        isFree: false,
        isFeatured: false,
        userId: adminId,
      },
    }),
  ]);

  console.log(`✓ Courses: ${courses.length}`);
  return courses;
}

async function seedChaptersAndLessons(courseId: string) {
  const chapter1 = await prisma.chapter.upsert({
    where: { id: `seed-ch-${courseId}-1` },
    update: { title: "Introduction to Tajweed", position: 1 },
    create: {
      id: `seed-ch-${courseId}-1`,
      title: "Introduction to Tajweed",
      position: 1,
      courseId,
    },
  });

  const chapter2 = await prisma.chapter.upsert({
    where: { id: `seed-ch-${courseId}-2` },
    update: { title: "Noon Sakinah Rules", position: 2 },
    create: {
      id: `seed-ch-${courseId}-2`,
      title: "Noon Sakinah Rules",
      position: 2,
      courseId,
    },
  });

  const lessons = await Promise.all([
    prisma.lesson.upsert({
      where: { id: `seed-lesson-${courseId}-1` },
      update: {},
      create: {
        id: `seed-lesson-${courseId}-1`,
        title: "What is Tajweed?",
        description: "<p>Introduction to Tajweed science.</p>",
        thumbnailKey: "seed/lessons/l1.jpg",
        position: 1,
        videoSource: "EMBED",
        embedUrl: "https://www.youtube.com/embed/2VDtnM9B3Ok",
        chapterId: chapter1.id,
      },
    }),
    prisma.lesson.upsert({
      where: { id: `seed-lesson-${courseId}-2` },
      update: {},
      create: {
        id: `seed-lesson-${courseId}-2`,
        title: "Makharij al-Huroof",
        description: "<p>Articulation points of letters.</p>",
        thumbnailKey: "seed/lessons/l2.jpg",
        position: 2,
        videoSource: "EMBED",
        embedUrl: "https://www.youtube.com/embed/2VDtnM9B3Ok",
        chapterId: chapter1.id,
      },
    }),
    prisma.lesson.upsert({
      where: { id: `seed-lesson-${courseId}-3` },
      update: {},
      create: {
        id: `seed-lesson-${courseId}-3`,
        title: "Izhaar and Idgham",
        description: "<p>Noon Sakinah rules part 1.</p>",
        thumbnailKey: "seed/lessons/l3.jpg",
        position: 1,
        videoSource: "EMBED",
        embedUrl: "https://www.youtube.com/embed/2VDtnM9B3Ok",
        chapterId: chapter2.id,
      },
    }),
  ]);

  console.log(`✓ Chapters & lessons for course ${courseId}`);
  return { chapter1, chapter2, lessons };
}

async function seedEnrolmentsAndProgress(
  courseId: string,
  lessonIds: string[],
  studentId: string
) {
  await prisma.enrolment.upsert({
    where: { courseId_userId: { courseId, userId: studentId } },
    update: { status: "Active", amount: 0 },
    create: {
      courseId,
      userId: studentId,
      status: "Active",
      amount: 0,
    },
  });

  if (lessonIds[0]) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: studentId, lessonId: lessonIds[0] } },
      update: { completed: true },
      create: {
        userId: studentId,
        lessonId: lessonIds[0],
        completed: true,
      },
    });
  }

  console.log("✓ Enrolments & lesson progress");
}

async function seedQuizzes(
  courseId: string,
  chapterId: string,
  studentId: string
) {
  const courseQuiz = await prisma.quiz.upsert({
    where: { id: `seed-quiz-course-${courseId}` },
    update: {},
    create: {
      id: `seed-quiz-course-${courseId}`,
      title: "Tajweed Final Quiz",
      type: "COURSE",
      courseId,
      isPublished: true,
      showCorrect: true,
      totalMarks: 10,
    },
  });

  const chapterQuiz = await prisma.quiz.upsert({
    where: { id: `seed-quiz-chapter-${chapterId}` },
    update: {},
    create: {
      id: `seed-quiz-chapter-${chapterId}`,
      title: "Chapter 1 Quiz",
      type: "CHAPTER",
      courseId,
      chapterId,
      googleFormUrl: "https://docs.google.com/forms/d/e/seed-chapter/viewform",
      isPublished: true,
      totalMarks: 5,
    },
  });

  const standaloneQuiz = await prisma.quiz.upsert({
    where: { slug: SEED.standaloneQuizSlug },
    update: {},
    create: {
      id: "seed-quiz-standalone",
      title: "General Quran Knowledge",
      slug: SEED.standaloneQuizSlug,
      type: "STANDALONE",
      smallDescription: "Test your basic Quran knowledge.",
      description: "<p>A standalone quiz open to all students.</p>",
      thumbnailKey: "seed/quizzes/standalone.jpg",
      isPublished: true,
      showCorrect: true,
      totalMarks: 20,
    },
  });

  const question1 = await prisma.quizQuestion.upsert({
    where: { id: "seed-qq-001" },
    update: {},
    create: {
      id: "seed-qq-001",
      quizId: standaloneQuiz.id,
      text: "How many Surahs are in the Quran?",
      position: 1,
      questionType: "SINGLE_CHOICE",
    },
  });

  await prisma.quizQuestion.upsert({
    where: { id: "seed-qq-002" },
    update: {},
    create: {
      id: "seed-qq-002",
      quizId: standaloneQuiz.id,
      text: "Name two rules of Noon Sakinah.",
      position: 2,
      questionType: "LONG_TEXT",
    },
  });

  const correctOption = await prisma.quizOption.upsert({
    where: { id: "seed-qo-001" },
    update: {},
    create: {
      id: "seed-qo-001",
      questionId: question1.id,
      text: "114",
      isCorrect: true,
      position: 1,
    },
  });

  await Promise.all([
    prisma.quizOption.upsert({
      where: { id: "seed-qo-002" },
      update: {},
      create: { id: "seed-qo-002", questionId: question1.id, text: "100", isCorrect: false, position: 2 },
    }),
    prisma.quizOption.upsert({
      where: { id: "seed-qo-003" },
      update: {},
      create: { id: "seed-qo-003", questionId: question1.id, text: "120", isCorrect: false, position: 3 },
    }),
  ]);

  await prisma.quizEnrolment.upsert({
    where: { quizId_userId: { quizId: standaloneQuiz.id, userId: studentId } },
    update: {},
    create: { quizId: standaloneQuiz.id, userId: studentId },
  });

  await prisma.quizSubmission.upsert({
    where: { quizId_userId: { quizId: chapterQuiz.id, userId: studentId } },
    update: {},
    create: {
      quizId: chapterQuiz.id,
      userId: studentId,
      answers: { [question1.id]: correctOption.id },
    },
  });

  console.log("✓ Quizzes, questions, options, enrolments & submissions");
  return { courseQuiz, chapterQuiz, standaloneQuiz };
}

async function seedClassrooms(
  teacherId: string,
  studentId: string,
  student2Id: string,
  departmentId: number
) {
  const classroom1 = await prisma.classroom.upsert({
    where: { slug: SEED.classroomSlugs[0] },
    update: {},
    create: {
      id: "seed-classroom-001",
      title: "Evening Tajweed Class",
      slug: SEED.classroomSlugs[0],
      price: 5000,
      description: "Live evening Tajweed sessions.",
      status: "Published",
      isFree: false,
      teacherId,
      userId: teacherId,
      departmentId,
      isActive: true,
    },
  });

  const classroom2 = await prisma.classroom.upsert({
    where: { slug: SEED.classroomSlugs[1] },
    update: {},
    create: {
      id: "seed-classroom-002",
      title: "Weekend Hifz Circle",
      slug: SEED.classroomSlugs[1],
      price: 0,
      description: "Free weekend memorization circle.",
      status: "Published",
      isFree: true,
      teacherId,
      userId: teacherId,
      departmentId,
      isActive: true,
    },
  });

  await prisma.classroomMember.upsert({
    where: { classroomId_userId: { classroomId: classroom1.id, userId: studentId } },
    update: { status: "APPROVED" },
    create: { classroomId: classroom1.id, userId: studentId, status: "APPROVED" },
  });

  if (student2Id !== studentId) {
    await prisma.classroomMember.upsert({
      where: { classroomId_userId: { classroomId: classroom1.id, userId: student2Id } },
      update: { status: "PENDING" },
      create: { classroomId: classroom1.id, userId: student2Id, status: "PENDING" },
    });
  }

  const post = await prisma.classroomPost.upsert({
    where: { id: "seed-post-001" },
    update: {},
    create: {
      id: "seed-post-001",
      classroomId: classroom1.id,
      authorId: teacherId,
      title: "Week 1 — Makharij Practice",
      content: "<p>Practice the articulation points we covered today.</p>",
      link: "",
    },
  });

  const classroomQuiz = await prisma.quiz.upsert({
    where: { id: "seed-quiz-classroom-001" },
    update: {},
    create: {
      id: "seed-quiz-classroom-001",
      title: "Live Class Quiz",
      type: "CLASSROOM",
      classroomId: classroom1.id,
      classroomPostId: post.id,
      googleFormUrl: "https://docs.google.com/forms/d/e/seed-class/viewform",
      isPublished: true,
      totalMarks: 10,
    },
  });

  await prisma.enrolment.upsert({
    where: { classroomId_userId: { classroomId: classroom1.id, userId: studentId } },
    update: { status: "Active", amount: 5000 },
    create: {
      classroomId: classroom1.id,
      userId: studentId,
      status: "Active",
      amount: 5000,
    },
  });

  console.log("✓ Classrooms, members, posts & classroom quiz");
  return { classroom1, classroom2, classroomQuiz };
}

async function seedAttendance(
  classroomId: string,
  studentId: string,
  student2Id: string
) {
  const date1 = new Date("2025-01-25T00:00:00.000Z");
  const date2 = new Date("2025-01-26T00:00:00.000Z");

  const attendance1 = await prisma.attendance.upsert({
    where: { classId_date: { classId: classroomId, date: date1 } },
    update: {},
    create: { id: "seed-attendance-001", classId: classroomId, date: date1 },
  });

  const attendance2 = await prisma.attendance.upsert({
    where: { classId_date: { classId: classroomId, date: date2 } },
    update: {},
    create: { id: "seed-attendance-002", classId: classroomId, date: date2 },
  });

  await prisma.attendanceRecord.upsert({
    where: { attendanceId_studentId: { attendanceId: attendance1.id, studentId } },
    update: { status: "PRESENT" },
    create: { attendanceId: attendance1.id, studentId, status: "PRESENT" },
  });

  if (student2Id !== studentId) {
    await prisma.attendanceRecord.upsert({
      where: { attendanceId_studentId: { attendanceId: attendance1.id, studentId: student2Id } },
      update: { status: "ABSENT" },
      create: { attendanceId: attendance1.id, studentId: student2Id, status: "ABSENT" },
    });
  }

  await prisma.attendanceRecord.upsert({
    where: { attendanceId_studentId: { attendanceId: attendance2.id, studentId } },
    update: { status: "PRESENT" },
    create: { attendanceId: attendance2.id, studentId, status: "PRESENT" },
  });

  console.log("✓ Attendance & records");
  return { attendance1, attendance2 };
}

async function seedQuizResults(
  quizId: string,
  studentId: string,
  classroomId: string
) {
  await prisma.quizResult.upsert({
    where: { quizId_studentId: { quizId, studentId } },
    update: { obtainedMarks: 8, totalMarks: 10 },
    create: {
      quizId,
      studentId,
      classroomId,
      totalMarks: 10,
      obtainedMarks: 8,
    },
  });

  console.log("✓ Quiz results");
}

async function seedContactAndNewsletter() {
  await prisma.contactSubmission.createMany({
    data: [
      {
        id: "seed-contact-001",
        name: "Ayesha Malik",
        email: "ayesha@example.com",
        message: "I want to enroll in the Tajweed course.",
      },
      {
        id: "seed-contact-002",
        name: "Hassan Raza",
        email: "hassan@example.com",
        message: "Do you offer weekend classes?",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.newsletterSubscription.createMany({
    data: [
      { id: "seed-newsletter-001", email: "subscriber@example.com" },
      { id: "seed-newsletter-002", email: "news@example.com" },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Contact submissions & newsletter subscriptions");
}

async function main() {
  console.log("🌱 Seeding database (all tables except User)...\n");

  const { admin, teacher, student, student2 } = await resolveUsers();
  console.log(`Using existing users:
  - Admin:   ${admin.email ?? admin.rollNumber ?? admin.id}
  - Teacher: ${teacher.email ?? teacher.rollNumber ?? teacher.id}
  - Student: ${student.email ?? student.rollNumber ?? student.id}
`);

  const departments = await seedDepartments();
  await seedCourseCategories();
  await seedProfiles(teacher, student, student2);

  const courses = await seedCourses(admin.id);
  const tajweedCourse = courses[0];

  const { chapter1, lessons } = await seedChaptersAndLessons(tajweedCourse.id);
  await seedEnrolmentsAndProgress(
    tajweedCourse.id,
    lessons.map((l) => l.id),
    student.id
  );

  const { chapterQuiz } = await seedQuizzes(
    tajweedCourse.id,
    chapter1.id,
    student.id
  );

  const { classroom1 } = await seedClassrooms(
    teacher.id,
    student.id,
    student2.id,
    departments.qs.id
  );

  await seedAttendance(classroom1.id, student.id, student2.id);
  await seedQuizResults(chapterQuiz.id, student.id, classroom1.id);
  await seedContactAndNewsletter();

  console.log("\n✅ Seed completed successfully!");
  console.log("Tables seeded: Department, CourseCategory, StudentProfile, TeacherProfile,");
  console.log("  Course, Chapter, Lesson, Enrolment, LessonProgress, Quiz, QuizQuestion,");
  console.log("  QuizOption, QuizSubmission, QuizEnrolment, QuizResult, Classroom,");
  console.log("  ClassroomMember, ClassroomPost, Attendance, AttendanceRecord,");
  console.log("  ContactSubmission, NewsletterSubscription");
  console.log("\nSkipped: User, Session, Account, Verification (auth tables)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
