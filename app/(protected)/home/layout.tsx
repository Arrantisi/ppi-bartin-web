"use client";

import { RealtimeProvider } from "@/components/providers/realtime-provider";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full px-0 md:px-5">
      <RealtimeProvider>{children}</RealtimeProvider>
    </div>
  );
};

export default HomeLayout;
