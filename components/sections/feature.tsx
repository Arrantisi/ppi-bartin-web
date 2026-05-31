import { ShieldCheck, Database, Image as ImageIcon, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Keamanan Data",
    description:
      "Integrasi Better Auth memastikan autentikasi lapis ganda yang sangat aman.",
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
  },
  {
    title: "Manajemen Database",
    description:
      "Penyimpanan cloud realtime dengan Supabase untuk akses data tanpa jeda.",
    icon: <Database className="w-8 h-8 text-primary" />,
  },
  {
    title: "Media Terpusat",
    description:
      "Pengunggahan dokumen dan foto kegiatan cepat menggunakan UploadThing.",
    icon: <ImageIcon className="w-8 h-8 text-primary" />,
  },
  {
    title: "Akses Transparan",
    description:
      "Dashboard publik untuk memantau program kerja dan laporan keuangan.",
    icon: <Eye className="w-8 h-8 text-primary" />,
  },
];

export const Features = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold mb-4">Pilar Utama Sistem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Teknologi canggih untuk mempermudah birokrasi dan meningkatkan
            kepercayaan anggota.
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
