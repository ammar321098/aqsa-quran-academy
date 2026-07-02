"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { EmptyState } from "@/components/general/EmptyState";

interface Classroom {
  id: string;
  title: string;
}

interface ResultRow {
  quizId: string;
  quizTitle: string;
  obtainedMarks: number;
  totalMarks: number;
}

export default function StudentResultsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomId, setClassroomId] = useState("");
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch student's classrooms
  useEffect(() => {
    fetch("/api/student/classrooms")
      .then((res) => res.json())
      .then(setClassrooms);
  }, []);

  // Fetch results when class changes
  useEffect(() => {
    if (!classroomId) {
      setResults([]);
      return;
    }

    setLoading(true);

    fetch(`/api/student/results?classroomId=${classroomId}`)
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          console.error("API error:", text);
          return [];
        }
        return text ? JSON.parse(text) : [];
      })
      .then(setResults)
      .catch((err) => {
        console.error("Fetch failed:", err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [classroomId]);

  console.log(results);

  return (
    <div className="px-4 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Results Page
          </h1>
          <p className="text-muted-foreground">
            Track your progress according to your results
          </p>
          <div className="h-px bg-border my-4" />
        </div>
      </div>
      {/* Classroom selector */}
      <div className="space-y-2 max-w-sm">
        <Label className="ml-2 font-bold">Select Classroom</Label>
        <Select value={classroomId} onValueChange={setClassroomId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select class" />
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

      {/* Results */}
      {!loading && results.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 hover:bg-gray-200 dark:bg-gray-900">
                <TableHead className="font-bold">Assignment / Quiz</TableHead>
                <TableHead className="font-bold ">Obtained</TableHead>
                <TableHead className="font-bold ">Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {results.map((r) => (
                <TableRow key={r.quizId}>
                  <TableCell>{r.quizTitle}</TableCell>
                  <TableCell>{r.obtainedMarks}</TableCell>
                  <TableCell>{r.totalMarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : loading ? (
        <p>Loading results...</p>
      ) : (
        <EmptyState
          title="No Results"
          description="Select a class to see your results."
          buttonText=""
          href=""
        />
      )}
    </div>
  );
}
