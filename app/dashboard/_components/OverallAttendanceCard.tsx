import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClassAttendancePie } from "./ClassAttendancePai";

type AttendanceSummary = {
  present: number;
  absent: number;
  leave: number;
};

type ClassItem = {
  classroom: {
    id: string;
    title: string;
  };
  attendanceSummary: AttendanceSummary;
};

export function OverallAttendanceCard({ classes }: { classes: ClassItem[] }) {
  // Calculate totals
  const totals = classes.reduce(
    (acc, item) => {
      acc.present += item.attendanceSummary.present;
      acc.absent += item.attendanceSummary.absent;
      acc.leave += item.attendanceSummary.leave;
      return acc;
    },
    { present: 0, absent: 0, leave: 0 },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Attendance</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Attendance Pie */}
        <div className="w-full max-w-lg mx-auto">
          <ClassAttendancePie {...totals} />
        </div>

        {/* Individual Classes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((item) => (
            <Card key={item.classroom.id} className="border w-full">
              <CardHeader>
                <CardTitle className="text-sm">
                  Class: {item.classroom.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col text-sm gap-1">
                  <span>🟢 Present(s): {item.attendanceSummary.present}</span>
                  <span>🔴 Absent(s): {item.attendanceSummary.absent}</span>
                  <span>🟡 Leave(s): {item.attendanceSummary.leave}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
