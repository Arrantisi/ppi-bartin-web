import { CardEventProps } from "@/types";
import CardEvent from "../card";

const cardEventProp: CardEventProps[] = [
  {
    image: "/nkri-news.jpeg",
    judul: " pelatihan public speaking",
    createdBy: "Josephine Grant",
    tanggal: "15 Maret 2026",
    lokasi: "Aula Kampus",
    description:
      " brave dark verb too court memory open excellent morning fought salmon soap birds chain describe story different base pass addition wind visit record runningopposite stood train store action branch winter because merely idea breakfast chief vessels noun pocket start secret everybody phrase tone was rise wire air",
    participant: [
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
  },
  {
    image: "/prestasi-news.jpeg",
    judul: "Workshop Beasiwa Erasmus",
    createdBy: "Eunice Wade",
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
    ],
    totalParticipant: "45",
  },
  {
    image: "/card-event-01.jpeg",
    judul: "Sharing Siswa Mahasiswa Baru",
    createdBy: "Eva Rose",
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
    ],
    totalParticipant: "45",
  },
  {
    image: "/passport-news.jpeg",
    judul: "Buka Puasa Bersama",
    createdBy: "Jerry Mills",
    tanggal: "15 Maret 2026",
    lokasi: "Aula Kampus",
    description:
      " brave dark verb too court memory open excellent morning fought salmon soap birds chain describe story different base pass addition wind visit record runningopposite stood train store action branch winter because merely idea breakfast chief vessels noun pocket start secret everybody phrase tone was rise wire air",
    participant: [
      {
        image: "/user-profile-05.png",
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
  },
];

const CardAcaras = () => {
  return (
    <div>
      {cardEventProp.map((e) => (
        <div key={e.judul} className="my-3">
          <CardEvent {...e} />
        </div>
      ))}
    </div>
  );
};

export default CardAcaras;
