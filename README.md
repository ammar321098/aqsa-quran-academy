# Next.js LMS Project

## Overview

This is a scalable **Learning Management System (LMS)** built with **Next.js App Router**, designed for admins, instructors, and end users (students). It supports authentication, course management, payments, enrolments, dashboards, and future quiz integrations.

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Better Auth** (Email / OTP)
- **2Checkout** (Payments)
- **AWS S3** (File uploads)
- **Tailwind CSS**

---

## Project Structure

```txt
┣ 📂(auth)
┃ ┣ 📂login
┃ ┃ ┣ 📂_components
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂verify-request
┃ ┃ ┣ 📂_components
┃ ┃ ┃ ┗ 📜otp-verification-client.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┗ 📜layout.tsx
┣ 📂(endusers)
┃ ┣ 📂_compoments
┃ ┃ ┣ 📜AnimationWraper.tsx
┃ ┃ ┣ 📜Navbar.tsx
┃ ┃ ┗ 📜UserDropdown.tsx
┃ ┣ 📂courses
┃ ┃ ┣ 📂_components
┃ ┃ ┃ ┣ 📜CourseContent.tsx
┃ ┃ ┃ ┣ 📜PublicCourseCard.tsx
┃ ┃ ┃ ┣ 📜PublicCoursesSkeletonLayout.tsx
┃ ┃ ┃ ┗ 📜RenderCourses.tsx
┃ ┃ ┣ 📂[slug]
┃ ┃ ┃ ┣ 📂_components
┃ ┃ ┃ ┃ ┗ 📜EnrollmentButton.tsx
┃ ┃ ┃ ┣ 📜actions.ts
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📜layout.tsx
┃ ┗ 📜page.tsx
┣ 📂admin
┃ ┣ 📂courses
┃ ┃ ┣ 📂_components
┃ ┃ ┃ ┣ 📜AdminCourseCard.tsx
┃ ┃ ┃ ┣ 📜AdminCourseCardSkeletonLayout.tsx
┃ ┃ ┃ ┗ 📜RenderCourses.tsx
┃ ┃ ┣ 📂[id]
┃ ┃ ┃ ┣ 📂[chapterId]
┃ ┃ ┃ ┃ ┗ 📂[lessonId]
┃ ┃ ┃ ┃   ┣ 📂_components
┃ ┃ ┃ ┃   ┃ ┗ 📜LessonForm.tsx
┃ ┃ ┃ ┃   ┣ 📜actions.ts
┃ ┃ ┃ ┃   ┗ 📜page.tsx
┃ ┃ ┃ ┣ 📂delete
┃ ┃ ┃ ┃ ┣ 📜actions.ts
┃ ┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┃ ┗ 📂edit
┃ ┃ ┃   ┣ 📂_components
┃ ┃ ┃   ┃ ┣ 📜CourseStructure.tsx
┃ ┃ ┃   ┃ ┣ 📜DeleteChapter.tsx
┃ ┃ ┃   ┃ ┣ 📜DeleteLesson.tsx
┃ ┃ ┃   ┃ ┣ 📜EditCourseForm.tsx
┃ ┃ ┃   ┃ ┣ 📜NewChapterModel.tsx
┃ ┃ ┃   ┃ ┗ 📜NewLessonModal.tsx
┃ ┃ ┃   ┣ 📜actions.ts
┃ ┃ ┃   ┗ 📜page.tsx
┃ ┃ ┣ 📂create
┃ ┃ ┃ ┣ 📜actions.ts
┃ ┃ ┃ ┗ 📜page.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂quiz
┃ ┃ ┗ 📂create
┃ ┃   ┣ 📜action.ts
┃ ┃   ┗ 📜page.tsx
┃ ┣ 📜layout.tsx
┃ ┗ 📜page.tsx
┣ 📂api
┃ ┣ 📂2checkout
┃ ┃ ┗ 📂webhooks
┃ ┃   ┗ 📜route.ts
┃ ┣ 📂admin
┃ ┃ ┣ 📂chapters
┃ ┃ ┃ ┗ 📜route.ts
┃ ┃ ┗ 📂courses
┃ ┃   ┗ 📜route.ts
┃ ┣ 📂auth
┃ ┃ ┗ 📂[...better-auth]
┃ ┃   ┗ 📜route.ts
┃ ┣ 📂enrolment
┃ ┃ ┗ 📂status
┃ ┃   ┗ 📜route.ts
┃ ┣ 📂quiz
┃ ┃ ┗ 📂quiz-submission
┃ ┃   ┗ 📜route.ts
┃ ┗ 📂s3
┃   ┣ 📂delete
┃   ┃ ┗ 📜route.ts
┃   ┗ 📂upload
┃     ┗ 📜route.ts
┣ 📂dashboard
┃ ┣ 📂_components
┃ ┃ ┣ 📜CourseProgressCard.tsx
┃ ┃ ┣ 📜CourseSidebar.tsx
┃ ┃ ┣ 📜DashboardAppSidebar.tsx
┃ ┃ ┣ 📜LessonItem.tsx
┃ ┃ ┗ 📜StartQuizButton.tsx
┃ ┣ 📂course
┃ ┃ ┗ 📂[slug]
┃ ┃   ┣ 📂[lessonId]
┃ ┃   ┃ ┣ 📂_components
┃ ┃   ┃ ┃ ┣ 📜CourseContent.tsx
┃ ┃   ┃ ┃ ┗ 📜LessonSkeleton.tsx
┃ ┃   ┃ ┣ 📜actions.ts
┃ ┃   ┃ ┗ 📜page.tsx
┃ ┃   ┣ 📜layout.tsx
┃ ┃   ┗ 📜page.tsx
┃ ┣ 📂quiz
┃ ┃ ┗ 📂[quizId]
┃ ┃   ┣ 📂_componnents
┃ ┃   ┃ ┗ 📜QuizDashboardPage.tsx
┃ ┃   ┗ 📜page.tsx
┃ ┣ 📜layout.tsx
┃ ┗ 📜page.tsx
┣ 📂data
┃ ┣ 📂admin
┃ ┃ ┣ 📜admin-get-course.ts
┃ ┃ ┣ 📜admin-get-courses.ts
┃ ┃ ┣ 📜admin-get-dashboard-stats.ts
┃ ┃ ┣ 📜admin-get-enrollment-stats.ts
┃ ┃ ┣ 📜admin-get-lesson.ts
┃ ┃ ┣ 📜admin-get-recent-courses.ts
┃ ┃ ┗ 📜require-admin.ts
┃ ┣ 📂course
┃ ┃ ┣ 📜get-all-courses.ts
┃ ┃ ┣ 📜get-course-sidebar-data.ts
┃ ┃ ┣ 📜get-course.ts
┃ ┃ ┗ 📜get-lesson-content.ts
┃ ┗ 📂user
┃   ┣ 📜get-inrolled-courses.ts
┃   ┣ 📜require-user.ts
┃   ┗ 📜user-is-enrolled.ts
┣ 📂not-admin
┃ ┗ 📜page.tsx
┣ 📂payment
┃ ┣ 📂cancel
┃ ┃ ┗ 📜page.tsx
┃ ┗ 📂success
┃   ┗ 📜page.tsx
┣ 📂profile
┃ ┗ 📜page.tsx
┣ 📜favicon.ico
┣ 📜globals.css
┗ 📜layout.tsx


components/
├── file-uploader/
├── general/
├── rich-text-editor/
├── sidebar/
└── ui/
```

---

## Routing Strategy

### Route Groups

- `(auth)` → Authentication routes (login, verification)
- `(endusers)` → Student-facing pages

### Dynamic Routes

- `[slug]` → Course identifier
- `[id]` → Admin course ID
- `[chapterId]`, `[lessonId]` → Nested learning content

---

## Roles & Access

### Admin

- Create, edit, delete courses
- Manage chapters and lessons
- Upload content to S3

### End User (Student)

- Browse courses
- Enroll in paid/free courses
- Access lessons via dashboard

---

## Payments

- Integrated with **2Checkout**
- Webhooks handled under `/api/2checkout/webhooks`
- Payment success & cancel pages

---

## File Uploads

- AWS S3 integration
- Routes:

  - `/api/s3/upload`
  - `/api/s3/delete`

---

## Quiz Module (Google Forms Integration)

This LMS supports quizzes using **Google Forms**, allowing fast creation and reliable submissions.

### Quiz Folder Structure

```txt
app/
├── admin/
│   └── quizzes/
│       ├── create/
│       │   └── _components/
│       ├── [quizId]/
│       │   ├── edit/
│       │   │   └── _components/
│       │   └── analytics/
│       └── _components/
│
├── (endusers)/
│   └── quizzes/
│       ├── [quizId]/
│       │   └── page.tsx
│       └── _components/
│
├── api/
│   └── quizzes/
│       ├── create/
│       ├── assign/
│       └── validate-access/
```

---

### Quiz Flow

#### Admin Flow

1. Admin creates quiz using **Google Forms**
2. Stores:

   - Google Form URL
   - Course ID
   - Lesson ID
   - Quiz title

3. Assigns quiz to a lesson

#### Student Flow

1. Student opens lesson
2. Clicks **Start Quiz**
3. Redirected to Google Form
4. Submits answers
5. Completion status saved

---

### Access Control

- Only **enrolled users** can access quizzes
- Validation via API:

  - `/api/quizzes/validate-access`

- Middleware checks:

  - Authentication
  - Course enrollment

---

---

## Future Enhancements

- Native quiz engine
- Auto grading
- Certificates
- Quiz analytics dashboard

---

## Getting Started

```bash
npm install
npm run dev
```

---

## License

MIT
