"use client";

import * as React from "react";
import {
  IconCalendar,
  IconDashboard,
  IconListDetails,
  IconReport,
} from "@tabler/icons-react";

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
import { NavMain } from "@/components/sidebar/nav-main";

const navMain = [
  {
    title: "Dashboard",
    url: "/teacher",
    icon: IconDashboard,
  },
  {
    title: "Results",
    url: "/teacher/results",
    icon: IconReport,
  },
  {
    title: "Attendance",
    url: "/teacher/attendance",
    icon: IconCalendar,
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
