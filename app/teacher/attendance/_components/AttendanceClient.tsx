"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { EmptyState } from "@/components/general/EmptyState";
import { Label } from "@/components/ui/label";

export default function TeacherAttendanceClient() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [classId, setClassId] = useState<string>("");
  const [classes, setClasses] = useState<any[]>([]);

  // Load all classes
  useEffect(() => {
    fetch("/api/teacher/classrooms")
      .then((res) => res.json())
      .then(setClasses);
  }, []);

  // Load all students of class
  useEffect(() => {
    if (!classId) return;

    fetch(`/api/classes/students?classroomId=${classId}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch students");
        }
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setAttendance({});
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load students");
      });
  }, [classId]);

  // Load attendance for students
  useEffect(() => {
    if (!classId || !date) return;

    setAttendance({});

    fetch(`/api/attendance?classId=${classId}&date=${date.toISOString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch attendance");
        }
        return res.json();
      })
      .then((data) => {
        if (!data?.records) return;

        // Map studentId => status for RadioGroups
        const map: Record<string, string> = {};
        data.records.forEach((r: any) => {
          map[r.studentId] = r.status;
        });

        setAttendance(map);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load attendance");
      });
  }, [classId, date]);

  //   function use for save attendance
  const saveAttendance = async () => {
    if (!classId || !date) {
      toast.error("Select class and date first");
      return;
    }

    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classId,
        date,
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      }),
    });

    toast.success("Attendance saved");
  };

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Class dropdown */}
        <div className="space-y-1 w-full">
          <Label className="ml-2 font-bold">Select Classroom</Label>
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date dropdown */}
        <div className="space-y-1">
          <Label className="ml-2 font-bold">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <h1 className="text-background">
                ---------------------------------------------------
              </h1>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full rounded-md border shadow-sm"
                disabled={(d) => d > new Date()}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {!classId ? (
        <div className="text-muted-foreground text-center py-10">
          Select a class and Date to view students
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-200 hover:bg-gray-200 dark:bg-gray-900 ">
                <TableRow>
                  <TableHead className="font-bold">Roll No</TableHead>
                  <TableHead className="">Name</TableHead>
                  <TableHead className="font-bold text-center">
                    Present
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Absent
                  </TableHead>
                  <TableHead className="font-bold text-center">Leave</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <EmptyState
                        title="No students"
                        description="This class has no students. Select another class to view students."
                        buttonText=""
                        href=""
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNumber || "N/A"}</TableCell>
                      <TableCell>
                        {student.studentProfile?.fullName ||
                          student.name ||
                          "N/A"}
                      </TableCell>

                      {["PRESENT", "ABSENT", "LEAVE"].map((status) => (
                        <TableCell key={status} className="text-center">
                          <RadioGroup
                            className="flex justify-center"
                            value={attendance[student.id] || ""}
                            onValueChange={(v) =>
                              setAttendance((prev) => ({
                                ...prev,
                                [student.id]: v,
                              }))
                            }
                          >
                            <RadioGroupItem value={status} />
                          </RadioGroup>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <Button onClick={saveAttendance}>Save Attendance</Button>
        </>
      )}
    </div>
  );
}
