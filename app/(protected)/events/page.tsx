import CardEvent from "@/components/event/card";
import CardBeritaTerbaru from "@/components/event/card-berita-terbaru";
import AcaraMendatang from "@/components/event/home/acara-mendatang";
import BeritaTerbaru from "@/components/event/home/berita-terbaru";
import ProfileHome from "@/components/event/home/profile";
import { CardEventProps } from "@/types";

const cardEventProp: CardEventProps = {
  image: "/card-event-01.jpeg",
  judul: " pelatihan public speaking",
  createdBy: "otong subrono",
  tanggal: "15 Maret 2026",
  lokasi: "Aula Kampus",
  description:
    " brave dark verb too court memory open excellent morning fought salmon soap birds chain describe story different base pass addition wind visit record runningopposite stood train store action branch winter because merely idea breakfast chief vessels noun pocket start secret everybody phrase tone was rise wire air",
  participant: [
    {
      image: "/user-profile-05.png",
    },
    {
      image: "/user-profile-02.png",
    },
    {
      image: "/user-profile-03.png",
    },
    {
      image: "/user-profile-04.png",
    },
    {
      image: "/user-profile-01.png",
    },
  ],
  totalParticipant: "45",
};

const EventPage = () => {
  return (
    <div>
      <ProfileHome />
      <AcaraMendatang>
        <CardEvent {...cardEventProp} />
      </AcaraMendatang>
      <BeritaTerbaru>
        <CardBeritaTerbaru />
      </BeritaTerbaru>
    </div>
  );
};

export default EventPage;
