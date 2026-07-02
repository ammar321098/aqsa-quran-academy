"use client";

import { useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "recharts";
import { toast } from "sonner";
import { adminVerifyStudent } from "../action";

type Teacher = {
  id: string;
  name: string;
  photo?: string | null;
};

type Student = {
  id: string;
  name: string;
  rollNumber: string;
  photo?: string | null;
  status: string;
};

interface ClassMembersProps {
  teachers: Teacher[];
  students: Student[];
  classroomId: string;
}

export default function ClassMembers({
  teachers,
  students,
  classroomId,
}: ClassMembersProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  return (
    <div className="space-y-6">
      {/*  Teachers  */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Class Teacher</h3>

        <div className="grid gap-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="flex items-center gap-3 p-3">
              <Avatar className="border-2 p-5">
                {teacher.photo && <AvatarImage src={teacher.photo} />}
                <AvatarFallback>
                  {teacher.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center gap-1">
                <p className="font-medium">{teacher.name}</p>
                <Badge variant="secondary">Teacher</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Students  */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Students</h3>

          <Input
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="space-y-2">
          {filteredStudents.length === 0 && (
            <p className="text-sm text-muted-foreground">No students found.</p>
          )}

          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="flex flex-row items-center gap-4 p-3"
            >
              <Avatar className="border-2 p-5">
                {student.photo && <AvatarImage src={student.photo} />}
                <AvatarFallback>
                  {student.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex gap-2">
                  <p className="font-medium">{student.name}</p>
                  <Badge
                    variant="outline"
                    className={
                      student.status === "APPROVED"
                        ? "text-primary"
                        : "text-destructive"
                    }
                  >
                    {student.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Roll No: {student.rollNumber}
                </p>
              </div>

              <Button
                size="sm"
                disabled={student.status === "APPROVED"}
                onClick={() => {
                  startTransition(async () => {
                    try {
                      await adminVerifyStudent(student.id, classroomId); // Pass classroomId as prop
                      toast.success("Student verified successfully!");
                    } catch (err) {
                      toast.error("Failed to verify student.");
                      console.error(err);
                    }
                  });
                }}
              >
                {student.status !== "APPROVED" ? "Verify" : "Verified"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
