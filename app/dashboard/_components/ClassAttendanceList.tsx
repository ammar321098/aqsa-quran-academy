import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClassAttendancePie } from "./ClassAttendancePai";

export function ClassAttendanceList({ classes }: { classes: any[] }) {
  return (
    <div className="space-y-4">
      {classes.map((item: any) => (
        <Card key={item.classroom.id}>
          <CardHeader>
            <CardTitle className="text-base">{item.classroom.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <ClassAttendancePie
              present={item.attendanceSummary.present}
              absent={item.attendanceSummary.absent}
              leave={item.attendanceSummary.leave}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
