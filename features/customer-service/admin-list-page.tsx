"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HomeLayoutComponent } from "@/components/layout/home-layout";
import { AdminTicketList } from "./components/admin-ticket-list";
import { getCurrentUserRole } from "@/server/actions/account";

const AdminListPage = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    getCurrentUserRole().then((role) => {
      if (role !== "ADMIN" && role !== "PENGURUS") {
        router.replace("/home/profile");
      } else {
        setAuthorized(true);
      }
    });
  }, [router]);

  if (authorized !== true) return null;

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
