"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSignout } from "@/hooks/use-signout";

interface UserDropdownProps {
  name?: string;
  email?: string;
  image?: string;
  role: string;
}

export function UserDropdown({
  name = "User Name",
  email,
  image,
  role,
}: UserDropdownProps) {
  const handleSignOut = useSignout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <Avatar>
            {image ? (
              <AvatarImage src={image} alt={name} />
            ) : (
              <AvatarFallback>{name[0]}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-sm">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 mt-2" align="end">
        {/* Optional top label */}
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={
              role === "admin"
                ? "/admin"
                : role === "teacher"
                  ? "/teacher"
                  : "/dashboard"
            }
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            {`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard `}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-2 text-red-600 "
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
