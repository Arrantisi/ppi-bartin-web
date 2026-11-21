"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { authClient } from "@/lib/auth/client";
import { SignOutSessionButton } from "./buttons";
import { IconLayoutDashboard, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { useCurrentUserRole } from "@/hooks/use-current-role";

const ButtonUser = () => {
  const { data: session } = authClient.useSession();
  const { data: role } = useCurrentUserRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={session?.user.image || ""}
            alt={session?.user.name}
          />
          <AvatarFallback>BA</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={session?.user.image || ""}
                alt={session?.user.name}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session?.user.name}</span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {role === "ADMIN" && (
            <Link href="/dashboard">
              <DropdownMenuItem>
                <IconLayoutDashboard />
                Panel Admin
              </DropdownMenuItem>
            </Link>
          )}
          {role === "ADMIN" ? (
            <Link href="/dashboard/settings">
              <DropdownMenuItem>
                <IconSettings />
                Pengaturan Admin
              </DropdownMenuItem>
            </Link>
          ) : (
            <Link href="/home/profile">
              <DropdownMenuItem>
                <IconSettings />
                Profil
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <SignOutSessionButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonUser;
