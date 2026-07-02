import { requireTeacher } from "@/app/data/user/require-teacher";
import { getQuizzesForTeacher } from "@/app/data/teacher/get-quizzes";
import { TeacherQuizPageClient } from "./_components/TeacherQuizPageClient";


type Params = Promise<{ id: string }>;
type ActiveForm = "in-app" | "google-form" | null;

export default async function TeacherQuizPage({ params }: { params: Params }) {
  const { id } = await params;
  await requireTeacher();

  const initialQuizzes = await getQuizzesForTeacher(id);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <TeacherQuizPageClient initialQuizzes={initialQuizzes} classroomId={id} />
    </div>
  );
}
