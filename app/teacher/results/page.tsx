"use client";
import { useState } from "react";
import { ClassroomQuizSelector } from "./_components/ClassroomQuizSelector";

export default function TeacherResultsPage() {
  const [classroomId, setClassroomId] = useState("");
  const [quizId, setQuizId] = useState("");

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Quiz Results{" "}
        </h1>
        <p className="text-muted-foreground">
          Upload results for classroom Students{" "}
        </p>
        <div className="h-px bg-border my-4" />
      </div>

      <div className="mt-6">
        <ClassroomQuizSelector
          classroomId={classroomId}
          setClassroomId={setClassroomId}
          quizId={quizId}
          setQuizId={setQuizId}
        />
      </div>
    </div>
  );
}
