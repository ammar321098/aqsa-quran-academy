"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  IconBuilding,
  IconCirclePlusFilled,
  IconListDetails,
  IconNews,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";

export function QuickCreateDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <IconCirclePlusFilled className="size-5" />
          <span className="hidden sm:inline">Quick Create</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <Link href="/admin/courses/create">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <IconListDetails className="size-4" />
            Create Course
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/classes">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <IconUsersGroup className="size-4" />
            Create Class
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/quiz">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <IconNews className="size-4" />
            Create Quiz
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/department">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <IconBuilding className="size-4" />
            Create Department
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/members">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <IconUser className="size-4" />
            Create Member
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
