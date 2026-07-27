"use client";

import {
  IconDotsVertical,
  IconListDetails,
  IconLogout,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import { HomeIcon, UsersIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import { useSignout } from "@/hooks/use-signout";
import Link from "next/link";
import { useEffect, useState } from "react";

// API fallback
async function fetchRollSession() {
  const res = await fetch("/api/get-roll-session");
  if (!res.ok) return null;
  return res.json();
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const handleSignOut = useSignout();

  const { data: betterAuthSession } = authClient.useSession();
  const [rollSession, setRollSession] = useState<any>(null);

  useEffect(() => {
    if (!betterAuthSession) {
      fetchRollSession().then(setRollSession);
    }
  }, [betterAuthSession]);

  const session = betterAuthSession ?? rollSession;
  const user = session?.user;

  if (!user) return null;

  const displayName =
    user.studentProfile?.fullName ??
    user.teacherProfile?.fullName ??
    user.name ??
    user.email?.split("@")[0] ??
    "User";

  const avatarFallback = displayName?.charAt(0) ?? user.email?.charAt(0) ?? "?";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg border-2">
                <AvatarImage src={user.image} alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                {user.email ? (
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                ) : (
                  <span className="text-muted-foreground truncate text-xs">
                    {user.rollNumber}
                  </span>
                )}
              </div>

              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <Avatar className="h-8 w-8 rounded-lg border-2">
                  <AvatarImage src={user.image} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  {user.email ? (
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  ) : (
                    <span className="text-muted-foreground truncate text-xs">
                      {user.rollNumber}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href="/">
                <DropdownMenuItem className="my-1 py-2 cursor-pointer">
                  <HomeIcon />
                  Home Page
                </DropdownMenuItem>
              </Link>

              <Link href="/profile">
                <DropdownMenuItem className="my-1 py-2 cursor-pointer">
                  <IconUser />
                  Profile
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
