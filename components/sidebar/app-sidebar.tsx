"use client";

import * as React from "react";
import { IconDashboard, IconListDetails, IconNews } from "@tabler/icons-react";

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
import { NewspaperIcon } from "lucide-react";

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
    title: "Quiz",
    url: "/admin/quiz/create",
    icon: IconNews,
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
                  src="/aqsaeducomp.png"
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
