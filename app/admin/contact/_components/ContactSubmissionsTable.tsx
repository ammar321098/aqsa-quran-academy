"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, User, Calendar, EyeIcon } from "lucide-react";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date | string;
};

export function ContactSubmissionsTable({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [selected, setSelected] = useState<Submission | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            All submissions ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No contact submissions yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-35">Name</TableHead>
                    <TableHead className="w-50">Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-40">Date</TableHead>
                    <TableHead className="w-30 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {sub.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${sub.email}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Mail className="h-4 w-4" />
                          {sub.email}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {sub.message}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(sub.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="cursor-pointer"
                          size="sm"
                          onClick={() => setSelected(sub)}
                        >
                          <EyeIcon className="h-4 w-4" />
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Contact message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selected.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-primary hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(selected.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
                <div className="rounded-md border bg-muted/30 p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Message
                  </p>
                  <p className="whitespace-pre-wrap text-sm">{selected.message}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
