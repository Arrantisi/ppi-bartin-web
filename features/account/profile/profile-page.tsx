"use client";

import { HomeLayoutComponent } from "@/components/layout/home-layout";
import { useProfileUser } from "@/hooks/use-users";
import { HeaderBand } from "./header-band";
import { TabsSection } from "./tabs-section";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePageSkeleton = () => (
  <HomeLayoutComponent>
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 pb-6 border-b border-border">
        <Skeleton className="size-20 rounded-full shrink-0" />
        <div className="flex flex-col items-center md:items-start gap-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex gap-1 border-b border-border">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 flex-1 max-w-28 rounded-none" />
        ))}
      </div>
    </div>
  </HomeLayoutComponent>
);

const ProfilePage = () => {
  const { data: user, isLoading } = useProfileUser();

  if (isLoading) return <ProfilePageSkeleton />;

  if (!user) return null;

  return (
    <HomeLayoutComponent>
      <div
        style={
          {
            "--page-accent": "#D44534",
            "--page-accent-subtle": "rgba(212, 69, 52, 0.08)",
            "--page-accent-hover": "#BD3524",
          } as React.CSSProperties
        }
      >
        <HeaderBand user={user} />
        <TabsSection user={user} />
      </div>
    </HomeLayoutComponent>
  );
};

export default ProfilePage;
