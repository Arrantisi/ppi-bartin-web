import { ButtonPreviusePage } from "@/components/buttons";
import {
  GantiNamaSiswaCard,
  GantiNomorSiswaCard,
  GantiTema,
  HapusAccount,
} from "@/components/setting/card";

const SettingsPage = () => {
  return (
    <div className="flex flex-col space-y-3 pb-24">
      <div className="flex justify-between items-start h-full">
        <div className="mt-4">
          <ButtonPreviusePage />
        </div>
        <div className="space-y-3 py-5 hidden md:flex flex-col items-end">
          <h1 className="text-4xl">Pengaturan Akun</h1>
          <p className="text-sm text-foreground">
            Kamu bisa atur kamu disini dan juga hapus akun kamu disini
          </p>
        </div>
      </div>
      <GantiNamaSiswaCard />
      <GantiNomorSiswaCard />
      <GantiTema />
      <HapusAccount />
    </div>
  );
};

export default SettingsPage;
