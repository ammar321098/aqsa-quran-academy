"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Award, Mail, PenLine, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type QuizResultsTableProps = {
  quiz: {
    id: string;
    title: string;
    type: string;
    totalMarks: number | null;
    courseTitle: string | null;
    chapterTitle: string | null;
  };
  results: {
    id: string;
    obtainedMarks: number;
    totalMarks: number;
    createdAt: Date | string;
    student: {
      id: string;
      name: string | null;
      email: string | null;
      rollNumber: string | null;
    };
  }[];
};

export function QuizResultsTable({ quiz, results }: QuizResultsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Student results ({results.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No submissions yet. Students must attempt the quiz to see results here.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Student</TableHead>
                  <TableHead className="w-[180px]">Email</TableHead>
                  <TableHead className="w-[100px]">Roll No</TableHead>
                  <TableHead className="w-[120px] text-center">Score</TableHead>
                  <TableHead className="w-[140px]">Submitted</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {r.student.name || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Mail className="h-4 w-4" />
                        {r.student.email || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {r.student.rollNumber || "—"}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {r.obtainedMarks} / {r.totalMarks}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(r.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/admin/quiz/${quiz.id}/submissions/${r.student.id}`}
                        >
                          <PenLine className="mr-1 h-4 w-4" />
                          View & grade
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
