import { CardEventProps } from "@/types";
import CardEvent from "../card";

const cardEventProp: CardEventProps[] = [
  {
    id: "9968d062-741e-5df3-9369-d73f0a8c5af1",
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
    id: "4304f3e9-76cf-5167-96e8-b8338d8a3e89",
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
    id: "bed8e2ee-5afc-5cda-bc72-b361eba7b7c6",
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
    id: "648b2c4b-7d05-5e1f-bf27-3aba95063a7a",
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
        <div key={e.id} className="my-3">
          <CardEvent {...e} />
        </div>
      ))}
    </div>
  );
};

export default CardAcaras;
