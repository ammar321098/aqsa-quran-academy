"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2Icon } from "lucide-react";
import { IconBuilding } from "@tabler/icons-react";
import { createDepartment, deleteDepartment } from "../action";
import { toast } from "sonner";

export default function DepartmentsClient({
  departments,
}: {
  departments: { id: number; name: string; code: string }[];
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleDelete = async (id: number) => {
    const res = await deleteDepartment(id);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-primary">Departments</h1>
        <p className="text-muted-foreground">
          Manage academic departments for students
        </p>
      </div>

            <div className="h-px bg-border" />


      {/* Add Department */}
      <form
        action={async (formData) => {
          const res = await createDepartment(formData);

          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
          
          setName("")
          setCode("")
        }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 pb-5">
              Add Department
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="space-y-1">
                <Label className="mx-2 mb-2">Department Name</Label>
                <Input
                  required
                  name="name"
                  placeholder="Department"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="mx-2 mb-2">Department Code</Label>
                <Input
                  required
                  name="code"
                  placeholder="Unique Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full font-bold">
                <Plus className="w-5 h-5" /> Add Department
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Department List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="relative rounded-2xl group">
            <CardContent className="p-5 flex items-center gap-3">
              {/* Icon */}
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <IconBuilding className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-medium">{dept.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Code: {dept.code}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(dept.id)}
                className="absolute top-3 right-3 transition bg-destructive/25 rounded-2xl p-2"
              >
                <Trash2Icon className="w-4 h-4 text-red-500 hover:text-red-600" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
