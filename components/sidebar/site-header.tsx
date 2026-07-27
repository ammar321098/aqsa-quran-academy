"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "../ui/themeToggle";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  IconBuilding,
  IconCirclePlusFilled,
  IconListDetails,
  IconNews,
  IconUsersGroup,
} from "@tabler/icons-react";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { QuickCreateDropdown } from "@/app/admin/_components/QuickCreateDropDown";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Aqsa Quran Academy</h1>
        <div className="ml-auto flex items-center gap-2">
          <QuickCreateDropdown />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
