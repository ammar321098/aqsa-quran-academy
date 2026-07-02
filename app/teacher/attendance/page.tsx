import TeacherAttendanceClient from "./_components/AttendanceClient";

export default function AttendancePage() {
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Students Attendance{" "}
        </h1>
        <p className="text-muted-foreground">
          Upload attendance for classroom Students{" "}
        </p>
        <div className="h-px bg-border my-4" />
      </div>
      <TeacherAttendanceClient />
    </div>
  );
}
