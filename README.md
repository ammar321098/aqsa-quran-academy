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
app/
├── (auth)/
│   ├── login/
│   └── verify-request/
│
├── (endusers)/
│   ├── courses/
│   │   ├── [slug]/
│   │   └── _components/
│   └── _components/
│
├── admin/
│   └── courses/
│       ├── create/
│       ├── [id]/
│       │   ├── delete/
│       │   ├── edit/
│       │   └── [chapterId]/[lessonId]/
│       └── _components/
│
├── api/
│   ├── auth/
│   ├── enrolment/
│   ├── 2checkout/
│   └── s3/
│
├── dashboard/
│   ├── [slug]/[lessonId]/
│   └── _components/
│
├── data/
│   ├── admin/
│   ├── course/
│   └── user/
│
├── payment/
│   ├── cancel/
│   └── success/
│
└── profile/

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
