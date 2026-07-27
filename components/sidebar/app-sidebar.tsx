"use client";

import * as React from "react";
import {
  IconBook,
  IconBuilding,
  IconDashboard,
  IconListDetails,
  IconMail,
  IconNews,
  IconTag,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

import { NavMain } from "./nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const navMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: IconDashboard,
  },

  {
    title: "Courses",
    url: "/admin/courses",
    icon: IconListDetails,
  },
  {
    title: "Course categories",
    url: "/admin/course-categories",
    icon: IconTag,
  },

  {
    title: "Quiz",
    url: "/admin/quiz",
    icon: IconNews,
  },
  {
    title: "Classes",
    url: "/admin/classes",
    icon: IconUsersGroup,
  },
  {
    title: "Departments",
    url: "/admin/department",
    icon: IconBuilding,
  },
  {
    title: "Members",
    url: "/admin/members",
    icon: IconUsers,
  },
  {
    title: "Contact",
    url: "/admin/contact",
    icon: IconMail,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <Image
                  src="/aqsaquranac.png"
                  width={36}
                  height={36}
                  alt="logo"
                  className="size-9 rounded-md"
                />{" "}
                <span className="text-base font-semibold text-primary">
                  Aqsa Quran Academy
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
