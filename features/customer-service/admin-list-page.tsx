"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HomeLayoutComponent } from "@/components/layout/home-layout";
import { AdminTicketList } from "./components/admin-ticket-list";
import { useCurrentUserRole } from "@/hooks/use-current-role";

const AdminListPage = () => {
  const router = useRouter();
  const { data: role, isLoading } = useCurrentUserRole();

  useEffect(() => {
    if (!isLoading && role !== "ADMIN" && role !== "PENGURUS") {
      router.replace("/home/profile");
    }
  }, [role, isLoading, router]);

  if (isLoading) return null;

  return (
    <HomeLayoutComponent>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary mb-1">
          Pesan Masuk
        </h1>
        <p className="text-sm text-text-secondary">
          Kelola pesan dan keluhan dari pengguna
        </p>
      </div>
      <AdminTicketList />
    </HomeLayoutComponent>
  );
};

export default AdminListPage;
