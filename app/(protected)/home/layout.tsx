import { HomeLayoutComponent } from "@/components/layouts/home-layout";
import { RealtimeProvider } from "@/components/providers/realtime-provider";
import { studentAccount } from "@/server/actions/account";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user: session } = await studentAccount();

  return (
    <div className="relative w-full px-0 md:px-5">
      <RealtimeProvider>
        <HomeLayoutComponent userRole={session.role || ""}>
          {children}
        </HomeLayoutComponent>
      </RealtimeProvider>
    </div>
  );
};

export default HomeLayout;
