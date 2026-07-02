"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentSchemaType } from "@/lib/zodSchema";
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
  onNext: (data: StudentSchemaType) => void;
  defaultVals?: StudentSchemaType;
}

interface Department {
  id: number;
  name: string;
}

export function StudentFormStep1({ onNext, defaultVals }: Step1Props) {
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

  const form = useForm<StudentSchemaType>({
    resolver: zodResolver(studentSchema),
    defaultValues: defaultVals ?? {
      fullName: "",
      cnic: "",
      phone: "",
      address: "",
      departmentId: "",
      role: 1,
    },
  });

  function handleNext(values: StudentSchemaType) {
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
                  <Input
                    placeholder="xxxxx-xxxxxxx-x"
                    maxLength={15}
                    {...field}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 5)
                        value = value.slice(0, 5) + "-" + value.slice(5);
                      if (value.length > 13)
                        value = value.slice(0, 13) + "-" + value.slice(13, 14);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mx-2 font-bold">Phone</FormLabel>
                <FormControl>
                  <Input placeholder="03XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mx-2 font-bold">Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
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
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
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
