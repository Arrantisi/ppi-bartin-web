import { EventCard } from "@/components/event/event-card";

type TCardEventItem = {
  id: string;
  nama: string;
  lokasi: string;
  foto: string;
  description: string;
}[];

const cardEventItems: TCardEventItem = [
  {
    id: "c409d2a4-e136-5b6c-be46-abefd3b40903",
    nama: "Cynthia Alvarez",
    lokasi: "Chile",
    foto: "/demo-poto-01.jpeg",
    description:
      "useful actually fastened grandfather ordinary fought parallel doubt hurried conversation any letter wagon troops running depth church police everything built crack local serve with",
  },
  {
    id: "1803fa01-2552-59ef-b1cc-0d2020bdd2c4",
    nama: "Dustin Knight",
    lokasi: "Swaziland",
    foto: "/demo-poto-02.jpeg",
    description:
      "machine central let large worse sad herself brave harder wrapped tune gravity stared car area disease operation rise upward rice apart beauty clothing highest",
  },
  {
    id: "5ca2749f-5e8e-5fb5-bf20-d06951c3b18a",
    nama: "Hattie Jennings",
    lokasi: "Macedonia",
    foto: "/demo-poto-03.jpeg",
    description:
      "sort upward swimming drew scientist mix square circle camp word usual concerned partly personal characteristic middle birth nearly forty unusual choose determine time ask",
  },
  {
    id: "a86dc35f-80ca-5bbc-b8d0-c0d5fb742d2e",
    nama: "Francis Roy",
    lokasi: "Sweden",
    foto: "/demo-poto-04.jpeg",
    description:
      "edge equally slightly hit additional giving flew place pony color north loud spider national broken store hang free heading construction growth danger hollow map",
  },
  {
    id: "f72e309e-4a6a-52af-8804-f8790bb4fd1e",
    nama: "Sue Norris",
    lokasi: "Nepal",
    foto: "/demo-poto-05.jpeg",
    description:
      "upward lay official property winter think mother return flight beauty material dark fifteen clothing post travel clock monkey produce plane difference soil pitch leaf",
  },
  {
    id: "b8eb9aa5-a01b-5888-b0d8-cee66737e9bd",
    nama: "Mattie Oliver",
    lokasi: "Jersey",
    foto: "/demo-poto-06.jpeg",
    description:
      "slip deer select supper minerals important taught neighbor engine each book rocket ground where taken skill blow that chosen accident string is park something",
  },
  {
    id: "a53285e7-74b1-5b6f-9afb-afbd940b4fd8",
    nama: "Dylan Lindsey",
    lokasi: "Lithuania",
    foto: "/demo-poto-07.jpeg",
    description:
      "practical wheat answer design sink source naturally so express jump throughout sound value torn boy dangerous warn idea rich attack fun play science operation",
  },
  {
    id: "6d92abb6-5a46-55ef-b4d7-ac295e0c2a4f",
    nama: "Della Abbott",
    lokasi: "Switzerland",
    foto: "/demo-poto-08.jpeg",
    description:
      "arrange chose cry through printed past thread remain seen eleven green gather agree tape reader birds adult arrangement knife trail dozen shut already grabbed",
  },
  {
    id: "77188868-e3c4-539e-8fdb-66e74a0f51e4",
    nama: "Emily Christensen",
    lokasi: "Micronesia",
    foto: "/demo-poto-09.jpeg",
    description:
      "tank hit spin balloon bar either when tent part produce dog knowledge again rope volume myself shall among tales fed facing label quick behavior",
  },
  {
    id: "1abdd9db-3954-51e7-a07b-e6b51bb4a9d2",
    nama: "Joe Sutton",
    lokasi: "Guyana",
    foto: "/demo-poto-10.jpeg",
    description:
      "sign return green vessels good including water cutting tiny sitting count outline eager couple rocky putting tribe actually brought trick equator rest else anywhere",
  },
  {
    id: "685b27fe-e04c-5b6b-b9f3-57c08a2acdda",
    nama: "Daisy Fernandez",
    lokasi: "Chile",
    foto: "/demo-poto-11.jpeg",
    description:
      "motor bear garden mathematics article such series doctor daughter crowd all corn picture naturally anybody arrive suddenly swung halfway vapor nor forth merely one",
  },
];

const page = () => {
  return (
    <div className="col-span-2 space-y-10 mt-11 md:mt-0">
      {cardEventItems.map((e) => (
        <EventCard
          key={e.id}
          nama={e.nama}
          description={e.description}
          foto={e.foto}
          lokasi={e.lokasi}
        />
      ))}
    </div>
  );
};

export default page;
