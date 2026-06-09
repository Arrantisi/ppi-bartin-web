import {
  IconBellRinging,
  IconCalendarMonth,
  IconPhoto,
  IconShieldCheck,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Masuk dengan mudah",
    description:
      "Anggota dapat login dengan akun Google lalu melengkapi profil secara bertahap.",
    icon: <IconShieldCheck className="w-8 h-8 text-primary" />,
  },
  {
    title: "Acara dan berita",
    description:
      "Informasi terkait organisasi, agenda, dan pengumuman penting ditampilkan di satu tempat.",
    icon: <IconCalendarMonth className="w-8 h-8 text-primary" />,
  },
  {
    title: "Unggah foto kegiatan",
    description:
      "Dokumentasi acara dan berita bisa ditambahkan dengan cepat agar arsip tetap rapi.",
    icon: <IconPhoto className="w-8 h-8 text-primary" />,
  },
  {
    title: "Notifikasi web",
    description:
      "Pengumuman penting dapat muncul langsung di browser anggota yang sudah mengizinkan.",
    icon: <IconBellRinging className="w-8 h-8 text-primary" />,
  },
];

export const Features = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 rounded-full bg-primary/10 text-primary hover:bg-primary/10">
            Fitur aktif
          </Badge>
          <h2 className="text-3xl font-extrabold mb-4">
            Yang sudah bisa dipakai sekarang
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Semua fitur di bawah ini dirancang agar anggota bisa tetap terhubung
            dengan kegiatan organisasi tanpa kerumitan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:shadow-md transition-shadow rounded-2xl"
            >
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle className="text-lg font-bold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
