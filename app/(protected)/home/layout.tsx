"use client";

import { RealtimeProvider } from "@/components/providers/realtime-provider";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative max-w-xl md:max-w-3xl xl:max-w-6xl mx-auto">
      <RealtimeProvider>{children}</RealtimeProvider>
    </div>
  );
};

export default HomeLayout;
