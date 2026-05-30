import { CustomerServiceCreate } from "@/components/field/create-customer-service";
import { HeaderFieldLayout } from "@/components/layout/header-field";

export const CustomerServiceComponent = () => {
  return (
    <HeaderFieldLayout href="/home/profile" label="Kirim Keluhan">
      <CustomerServiceCreate />
    </HeaderFieldLayout>
  );
};
