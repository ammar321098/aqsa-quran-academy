"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";
import { EmptyState } from "@/components/general/EmptyState";

interface Quiz {
  id: string;
  title: string;
}

interface ClassroomPost {
  id: string;
  title: string;
  quizes: Quiz[];
}

interface Classroom {
  id: string;
  title: string;
  posts: ClassroomPost[];
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  obtainedMarks: number | null;
  totalMarks: number;
}

interface Props {
  classroomId: string;
  setClassroomId: (id: string) => void;
  quizId: string;
  setQuizId: (id: string) => void;
}

export function ClassroomQuizSelector({
  classroomId,
  setClassroomId,
  quizId,
  setQuizId,
}: Props) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/teacher/classrooms")
      .then((res) => res.json())
      .then(setClassrooms);
  }, []);

  useEffect(() => {
    setQuizId("");
    setStudents([]);

    if (!classroomId) {
      setQuizzes([]);
      return;
    }

    const classroom = classrooms.find((c) => c.id === classroomId);
    setQuizzes(classroom ? classroom.posts.flatMap((p) => p.quizes) : []);
  }, [classroomId, classrooms, setQuizId]);

  useEffect(() => {
    if (!classroomId || !quizId) return;

    setLoadingStudents(true);
    fetch(`/api/teacher/classrooms/${classroomId}/quizzes/${quizId}/students`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoadingStudents(false);
      });
  }, [classroomId, quizId]);

  const saveResults = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teacher/quiz/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          students.map((s) => ({
            quizId,
            classroomId,
            studentId: s.id,
            obtainedMarks: s.obtainedMarks ?? 0,
            totalMarks: s.totalMarks,
          })),
        ),
      });

      if (!res.ok) throw new Error();
      toast.success("Results saved successfully");
    } catch {
      toast.error("Failed to save results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="ml-2 font-bold">Classroom</Label>
          <Select value={classroomId} onValueChange={setClassroomId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select classroom" />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="ml-2 font-bold">Quiz</Label>
          <Select
            value={quizId}
            onValueChange={setQuizId}
            disabled={!classroomId || quizzes.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select quiz" />
            </SelectTrigger>
            <SelectContent>
              {quizzes.map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Students Table */}
      {loadingStudents && <p>Loading students...</p>}

      {!loadingStudents && students.length > 0 ? (
        <>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200 hover:bg-gray-200 dark:bg-gray-900">
                  <TableHead className="font-bold">Roll No</TableHead>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Obtained</TableHead>
                  <TableHead className="font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.rollNumber}</TableCell>
                    <TableCell>{s.name}</TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        className="w-24"
                        value={s.obtainedMarks ?? ""}
                        onChange={(e) =>
                          setStudents((prev) =>
                            prev.map((st) =>
                              st.id === s.id
                                ? { ...st, obtainedMarks: +e.target.value }
                                : st,
                            ),
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        className="w-24"
                        value={s.totalMarks}
                        onChange={(e) =>
                          setStudents((prev) =>
                            prev.map((st) =>
                              st.id === s.id
                                ? { ...st, totalMarks: +e.target.value }
                                : st,
                            ),
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            onClick={saveResults}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <span>Save Results</span> <SaveIcon />
              </>
            )}
          </Button>
        </>
      ) : (
        <EmptyState
          title="No Results"
          description="For see results select class and quiz before."
          buttonText=""
          href=""
        />
      )}
    </div>
  );
}
