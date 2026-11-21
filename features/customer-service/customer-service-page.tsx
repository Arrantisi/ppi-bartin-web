"use client";

import { HeaderFieldLayout } from "@/components/layout/header-field";
import { CustomerServiceForm } from "./components/customer-service-form";

const CustomerServicePage = () => {
  return (
    <HeaderFieldLayout href="/home/profile" label="Customer Service">
      <p className="text-sm text-text-secondary mb-6">
        Kirim pesan untuk melaporkan bug, kendala, atau memberikan saran untuk aplikasi PPI Bartin.
      </p>
      <CustomerServiceForm />
    </HeaderFieldLayout>
  );
};

export default CustomerServicePage;
