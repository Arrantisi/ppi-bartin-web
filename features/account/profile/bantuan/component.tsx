import { BantuanCreate } from "@/components/field/create-bantuan";
import { HeaderFieldLayout } from "@/components/layout/header-field";

export const BantuanComponent = () => {
  return (
    <HeaderFieldLayout href="/home/profile" label="Bantuan">
      <BantuanCreate />
    </HeaderFieldLayout>
  );
};
