import EventDetail from "@/components/event/event-detail";
import { CardEventProps } from "@/types";

const cardEventProp: CardEventProps = {
  id: "ba74b474-9b4d-56f7-abfa-6f8e474ded86",
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
  ],
  totalParticipant: "45",
};

const DetailEventPage = () => {
  return (
    <div>
      <EventDetail {...cardEventProp} />
    </div>
  );
};

export default DetailEventPage;
