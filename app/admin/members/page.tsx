"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Pencil,
  PlusIcon,
  SearchIcon,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteMember } from "./action";
import { toast } from "sonner";

type Student = {
  id: string;
  fullName: string;
  rollNumber?: string;
  image?: string;
  department?: string;
};
type Teacher = {
  id: string;
  fullName: string;
  rollnumber?: string;
  image?: string;
  department?: string;
};

export default function MembersPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [studentQuery, setStudentQuery] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch("/api/members"); // You need to create this API route
        const data = await res.json();
        setStudents(data.students);
        setTeachers(data.teachers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(studentQuery.toLowerCase()) ||
        (s.rollNumber ?? "")
          .toLowerCase()
          .includes(studentQuery.toLowerCase()) ||
        (s.department ?? "").toLowerCase().includes(studentQuery.toLowerCase()),
    );
  }, [studentQuery, students]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(teacherQuery.toLowerCase()) ||
        (t.rollnumber ?? "")
          .toLowerCase()
          .includes(teacherQuery.toLowerCase()) ||
        (t.department ?? "").toLowerCase().includes(teacherQuery.toLowerCase()),
    );
  }, [teacherQuery, teachers]);

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary">All Members</h1>
          <p className="text-muted-foreground">
            Add & Manage see all members of system (Teachers and Students)
          </p>
        </div>{" "}
        <div className="flex gap-2 flex-wrap">
          <Button>
            <Link
              href="/onboarding"
              className="flex gap-1 justify-center items-center"
            >
              <PlusIcon />
              Create New Member
            </Link>
          </Button>
        </div>
      </div>{" "}
      <div className="h-px bg-border" />
      {loading ? (
        <Card className="p-6 text-center">Loading...</Card>
      ) : (
        <>
          {/* Students Section */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle>Students ({students.length})</CardTitle>
              <div className="relative w-full max-w-xs">
                <Input
                  placeholder="Search Students..."
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  className="max-w-xs"
                />
                <SearchIcon
                  className="absolute right-3 top-3 text-muted-foreground"
                  size={16}
                />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((s) => (
                <MemberCard
                  key={s.id}
                  id={s.id}
                  name={s.fullName}
                  image={s.image}
                  subtitle={`Roll No: ${s.rollNumber ?? "N/A"}`}
                  department={s.department ?? "N/A"}
                  onDeleted={() =>
                    setStudents((prev) =>
                      prev.filter((student) => student.id !== s.id),
                    )
                  }
                />
              ))}
            </CardContent>
          </Card>

          {/* Teachers Section */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle>Teachers ({teachers.length})</CardTitle>
              <div className="relative w-full max-w-xs">
                <Input
                  placeholder="Search Teachers..."
                  value={teacherQuery}
                  onChange={(e) => setTeacherQuery(e.target.value)}
                  className="max-w-sm"
                />
                <SearchIcon
                  className="absolute right-3 top-3 text-muted-foreground"
                  size={16}
                />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTeachers.map((t) => (
                <MemberCard
                  key={t.id}
                  id={t.id}
                  name={t.fullName}
                  image={t.image}
                  subtitle={`Roll No: ${t.rollnumber ?? "N/A"}`}
                  department={t.department ?? "N/A"}
                  onDeleted={() =>
                    setTeachers((prev) =>
                      prev.filter((teacher) => teacher.id !== t.id),
                    )
                  }
                />
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function MemberCard({
  id,
  name,
  image,
  subtitle,
  department,
  onDeleted,
}: {
  id: string;
  name: string;
  image?: string;
  subtitle: string;
  department: string;
  onDeleted: () => void;
}) {
  const fallback = name.charAt(0).toUpperCase();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this member?");
    if (!confirmed) return;

    const loadingToast = toast.loading("Deleting member...");

    try {
      const res = await deleteMember(id);

      if (res.success) {
        toast.success("Member deleted successfully", {
          id: loadingToast,
        });

        onDeleted();
      } else {
        toast.error("Failed to delete member", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary/30">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 min-w-0">
        <Avatar className="h-12 w-12 border-2 border-muted shadow-sm">
          <AvatarImage src={image ?? undefined} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {fallback}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{name}</p>

          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>

          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 rounded-md"
            >
              {department}
            </Badge>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/profile/${id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              Delete member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
