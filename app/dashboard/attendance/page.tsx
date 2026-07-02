"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

interface Classroom {
  id: string;
  title: string;
}

interface AttendanceRecord {
  date: string; // ISO string
  status: "PRESENT" | "ABSENT" | "LATE";
}

const months = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

export default function StudentAttendancePage() {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [classId, setClassId] = useState("");
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  /* Load classrooms */
  useEffect(() => {
    fetch("/api/student/classrooms")
      .then((res) => res.json())
      .then(setClassrooms);
  }, []);

  useEffect(() => {
    console.log("RAW attendance records from API:", records);
  }, [records]);

  /* Load attendance */
  useEffect(() => {
    if (!classId) return;

    fetch(
      `/api/student/attendance?classId=${classId}&month=${month + 1}&year=${year}`,
    )
      .then((res) => res.json())
      .then(setRecords);
  }, [classId, month, year]);

  /* Get all days in selected month */
  const allDays = useMemo(() => {
    const days: Date[] = [];
    const date = new Date(year, month, 1);

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }, [month, year]);

  /* Normalize date to yyyy-mm-dd (LOCAL SAFE) */
  function normalizeDateKey(input: string | Date): string | null {
    const d = new Date(input);
    if (isNaN(d.getTime())) return null;

    const local = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    return format(local, "yyyy-MM-dd");
  }

  /* Build attendance lookup */
  const attendanceMap = useMemo(() => {
    const map: Record<string, AttendanceRecord["status"]> = {};

    for (const r of records) {
      const key = normalizeDateKey(r.date);
      if (key) map[key] = r.status;
    }

    return map;
  }, [records]);

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Student Attendance</h1>

        <p className="text-muted-foreground">
          Track your progress according to your results
        </p>
      </div>
      <div className="h-px bg-border my-4" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="font-bold ml-2">Classroom</Label>
          <Select value={classId} onValueChange={setClassId}>
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

        <div>
          <Label className="font-bold ml-2">Month</Label>
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="font-bold ml-2">Year</Label>
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {!classId ? (
        <div className="text-center text-muted-foreground py-10">
          Select a classroom to view attendance
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-200 hover:bg-gray-200 dark:bg-gray-900 ">
              <TableRow>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDays.map((day) => {
                const key = normalizeDateKey(day)!;
                const status = attendanceMap[key];

                return (
                  <TableRow key={key}>
                    <TableCell>{format(day, "d MMMM")}</TableCell>
                    <TableCell className="text-center">
                      {status ? (
                        <Badge
                          variant={
                            status === "PRESENT"
                              ? "default"
                              : status === "ABSENT"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
