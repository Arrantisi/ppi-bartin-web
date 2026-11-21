import { ButtonPreviusePage } from "@/components/buttons";
import { GantiTema } from "@/components/setting/card";
import { PushNotificationSwitch } from "@/components/push-notification-switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
            Kamu bisa atur tampilan dan preferensi akun kamu disini
          </p>
        </div>
      </div>
      <GantiTema />
      <Card>
        <CardHeader>
          <CardTitle className="font-2xl">Notifikasi</CardTitle>
          <CardDescription>
            Kelola notifikasi push untuk ponsel kamu
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <PushNotificationSwitch />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
