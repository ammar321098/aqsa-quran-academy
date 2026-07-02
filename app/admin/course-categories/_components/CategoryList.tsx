"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createCourseCategory, deleteCourseCategory } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Loader2, PlusIcon, Trash2 } from "lucide-react";

type Category = { id: string; name: string };

export function CategoryList({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [pending, setPending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate() {
    if (!newName.trim()) return;
    setPending(true);
    const { data, error } = await tryCatch(
      createCourseCategory(newName.trim()),
    );
    setPending(false);
    if (error) {
      toast.error("Something went wrong");
      return;
    }
    if (data?.status === "success") {
      const res = await fetch("/api/admin/course-categories");
      const list = await res.json();
      setCategories(list);
      setNewName("");
      setOpen(false);
      toast.success(data.message);
    } else {
      toast.error(data?.message ?? "Failed");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const { data, error } = await tryCatch(deleteCourseCategory(id));
    setDeletingId(null);
    if (error) {
      toast.error("Something went wrong");
      return;
    }
    if (data?.status === "success") {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success(data.message);
    } else {
      toast.error(data?.message ?? "Failed");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage categories used when creating courses.
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Tafseer"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={pending || !newName.trim()}
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center">
            No categories yet. Add one above.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
