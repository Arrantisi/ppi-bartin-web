"use client";

import { useParams } from "next/navigation";
import { HomeLayoutComponent } from "@/components/layout/home-layout";
import { AdminTicketDetail } from "./components/admin-ticket-detail";

const CustomerServiceDetailPage = () => {
  const params = useParams();
  const ticketId = params.id as string;

  return (
    <HomeLayoutComponent>
      <div className="max-w-3xl">
        <AdminTicketDetail ticketId={ticketId} />
      </div>
    </HomeLayoutComponent>
  );
};

export default CustomerServiceDetailPage;
