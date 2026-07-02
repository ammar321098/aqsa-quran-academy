"use client";

import { useMemo, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { addStudentToClass } from "../action";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type NonMemberStudent = {
  id: string;
  fullName: string;
  rollNumber: string;
  photo?: string | null;
};

interface AddStudentsProps {
  students: NonMemberStudent[];
  classroomId: string;
}

export function AddStudentsToClass({
  students,
  classroomId,
}: AddStudentsProps) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Add Students to This Class</h3>

      {students.length === 0 && (
        <p className="text-sm text-muted-foreground">
          All students are already members of this class.
        </p>
      )}

      {/* Teachers Section */}
      <div className="flex items-center justify-between mb-5">
        <h2>Total Students ({students.length})</h2>
        <Input
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {filteredStudents.length === 0 && (
        <p className="text-sm text-muted-foreground">No students found.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <AddStudentCard
            key={student.id}
            name={student.fullName}
            image={student.photo}
            rollNumber={student.rollNumber}
            disabled={isPending}
            onAdd={() =>
              startTransition(async () => {
                try {
                  await addStudentToClass(student.id, classroomId);
                  toast.success("Student added to class!");
                } catch {
                  toast.error("Failed to add student");
                }
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

function AddStudentCard({
  name,
  image,
  rollNumber,
  onAdd,
  disabled,
}: {
  name: string;
  image?: string | null;
  rollNumber: string;
  onAdd: () => void;
  disabled?: boolean;
}) {
  const fallback = name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center px-8 gap-3 rounded-lg border p-5 hover:bg-muted/50 transition">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={image ?? undefined} alt={name} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>

        <div className="flex-1 leading-tight">
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">Roll No: {rollNumber}</p>
        </div>
      </div>
      <Button onClick={onAdd} disabled={disabled} className="w-full">
        Add to Class
      </Button>
    </div>
  );
}
