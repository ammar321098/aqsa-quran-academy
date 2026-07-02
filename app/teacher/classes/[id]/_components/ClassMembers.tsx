import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string | null;
}

interface ClassroomMembersProps {
  teacher: any;
  students: any[];
}

export function ClassMembers({ teacher, students }: ClassroomMembersProps) {
  return (
    <Card className="sticky top-5">
      <CardHeader>
        <CardTitle className="text-base">Members</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teacher */}
        <div>
          <p className="text-sm mb-2">Teacher</p>
          <MemberItem name={teacher.fullName || "Unknown"} />
        </div>

        {/* Students */}
        <div>
          <p className="text-sm  mb-2">Student(s)</p>
          <div className="space-y-2">
            {students.length ? (
              students.map((student) => (
                <MemberItem
                  key={student.id}
                  name={student.fullName || "Unknown"}
                />
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                Students Not found
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MemberItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-8 border-2">
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{name}</span>
    </div>
  );
}
