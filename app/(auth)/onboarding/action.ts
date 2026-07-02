"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

interface RegisterStudentInput {
  rollNumber: string;
  password: string;
  fullName: string;
  cnic: string;
  phone: string;
  address: string;
  departmentId: string;
  role: string;
}

interface RegisterTeacherInput {
  rollNumber: string;
  password: string;
  fullName: string;
  cnic: string;
  departmentId: string;
  role: string;
}

export async function registerStudent(data: RegisterStudentInput) {
  const existingUser = await requireUser(); // returns User | null
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Validate department exists
  const department = await prisma.department.findUnique({
    where: { id: Number(data.departmentId) },
  });
  if (!department) {
    return { success: false, message: "Selected department does not exist" };
  }

  // Check if roll number already exists
  const rollExists = await prisma.user.findUnique({
    where: { rollNumber: data.rollNumber },
  });

  if (rollExists && (!existingUser || existingUser.id !== rollExists.id)) {
    return { success: false, message: "Roll number already exists" };
  }

  // Check if CNIC already exists
  const cnicExists = await prisma.studentProfile.findFirst({
    where: { cnic: data.cnic },
  });

  if (cnicExists && (!existingUser || existingUser.id !== cnicExists.userId)) {
    return { success: false, message: "User with this CNIC already exists" };
  }

  if (existingUser && existingUser.role !== "admin") {
    // UPDATE existing user
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        rollNumber: data.rollNumber,
        password: hashedPassword,
        role: "student",
        isStudent: true,
        studentVerified: false,
        departmentId: Number(data.departmentId),

        studentProfile: {
          upsert: {
            create: {
              fullName: data.fullName,
              cnic: data.cnic,
              phone: data.phone,
              address: data.address,
              verified: false,
            },
            update: {
              fullName: data.fullName,
              cnic: data.cnic,
              phone: data.phone,
              address: data.address,
            },
          },
        },
      },
    });

    revalidatePath("/onboarding");
    return { success: true, message: "Student updated successfully" };
  } else {
    // CREATE new user
    await prisma.user.create({
      data: {
        rollNumber: data.rollNumber,
        password: hashedPassword,
        role: "student",
        isStudent: true,
        studentVerified: false,
        departmentId: Number(data.departmentId),

        studentProfile: {
          create: {
            fullName: data.fullName,
            cnic: data.cnic,
            phone: data.phone,
            address: data.address,
            verified: false,
          },
        },
      },
    });
    revalidatePath("/onboarding");
    return { success: true, message: "Student registered successfully" };
  }
}

export async function registerTeacher(data: RegisterTeacherInput) {
  const existingUser = await requireUser(); // returns User | null
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Validate department exists
  const department = await prisma.department.findUnique({
    where: { id: Number(data.departmentId) },
  });
  if (!department) {
    return { success: false, message: "Selected department does not exist" };
  }

  // Check if roll number already exists
  const rollExists = await prisma.user.findUnique({
    where: { rollNumber: data.rollNumber },
  });

  if (rollExists && (!existingUser || existingUser.id !== rollExists.id)) {
    return { success: false, message: "Roll number already exists" };
  }

  // Check if CNIC already exists
  const cnicExists = await prisma.teacherProfile.findFirst({
    where: { cnic: data.cnic },
  });

  if (cnicExists && (!existingUser || existingUser.id !== cnicExists.userId)) {
    return { success: false, message: "User with this CNIC already exists" };
  }

  // UPDATE existing user
  if (existingUser && existingUser.role !== "admin") {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        rollNumber: data.rollNumber,
        password: hashedPassword,
        role: "teacher",
        isTeacher: true,
        teacherVerified: false,

        departmentId: Number(data.departmentId),
        teacherProfile: {
          upsert: {
            create: {
              fullName: data.fullName,
              cnic: data.cnic,
              verified: false,
            },
            update: {
              fullName: data.fullName,
              cnic: data.cnic,
            },
          },
        },
      },
    });
    revalidatePath("/onboarding");
    return { success: true, message: "Teacher updated successfully" };
  }

  // CREATE new user
  await prisma.user.create({
    data: {
      rollNumber: data.rollNumber,
      password: hashedPassword,
      role: "teacher",
      isTeacher: true,
      teacherVerified: false,
      departmentId: Number(data.departmentId),
      teacherProfile: {
        create: {
          fullName: data.fullName,
          cnic: data.cnic,
          verified: false,
        },
      },
    },
  });

  revalidatePath("/onboarding");
  return { success: true, message: "Teacher registered successfully" };
}
