"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { TgetProfileUser } from "@/server/data/users";
import { TabProfil } from "./tab-profil";
import { TabKegiatan } from "./tab-kegiatan";
import { TabPengaturan } from "./tab-pengaturan";

type Props = {
  user: NonNullable<TgetProfileUser>;
};

export const TabsSection = ({ user }: Props) => {
  return (
    <Tabs defaultValue="profil" className="w-full mt-6 overflow-hidden">
      <TabsList
        variant="line"
        className="w-full border-b border-border gap-0"
      >
        <TabsTrigger
          value="profil"
          className="flex-1 max-w-32 rounded-none data-[variant=line]:data-active:after:opacity-100 after:bg-[var(--page-accent)]"
        >
          Profil
        </TabsTrigger>
        <TabsTrigger
          value="kegiatan"
          className="flex-1 max-w-32 rounded-none data-[variant=line]:data-active:after:opacity-100 after:bg-[var(--page-accent)]"
        >
          Kegiatan
        </TabsTrigger>
        <TabsTrigger
          value="pengaturan"
          className="flex-1 max-w-32 rounded-none data-[variant=line]:data-active:after:opacity-100 after:bg-[var(--page-accent)]"
        >
          Pengaturan
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profil">
        <TabProfil user={user} />
      </TabsContent>

      <TabsContent value="kegiatan">
        <TabKegiatan user={user} />
      </TabsContent>

      <TabsContent value="pengaturan">
        <TabPengaturan user={user} />
      </TabsContent>
    </Tabs>
  );
};
