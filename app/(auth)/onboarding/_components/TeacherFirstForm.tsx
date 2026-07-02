"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSchema, TeacherSchemaType } from "@/lib/zodSchema";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface Step1Props {
  onNext: (data: TeacherSchemaType) => void;
  defaultVals?: TeacherSchemaType;
}

interface Department {
  id: number;
  name: string;
}

export function TeacherFormStep1({ onNext, defaultVals }: Step1Props) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDepartments();
  }, []);

  const form = useForm<TeacherSchemaType>({
    resolver: zodResolver(teacherSchema),
    defaultValues: defaultVals ?? {
      fullName: "",
      cnic: "",
      departmentId: "",
      role: 2,
    },
  });

  function handleNext(values: TeacherSchemaType) {
    onNext(values);
  }

  if (loading) return <Card className="p-6 text-center">Loading...</Card>;

  return (
    <Card className="p-6 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNext)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mx-2 font-bold">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cnic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mx-2 font-bold">
                  CNIC (with dashes)
                </FormLabel>
                <FormControl>
                  <Input placeholder="12345-1234567-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="mx-2 font-bold">Department</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full font-bold">
            Next
          </Button>
        </form>
      </Form>
    </Card>
  );
}
