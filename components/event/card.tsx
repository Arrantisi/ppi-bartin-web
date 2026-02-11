import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { IconCalendarWeek, IconMapPin } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardEventProps } from "@/types";

const CardEvent = ({
  createdBy,
  description,
  image,
  judul,
  lokasi,
  participant,
  tanggal,
  totalParticipant,
}: CardEventProps) => {
  return (
    <Card className="py-2 shadow-2xl">
      <CardHeader className="px-2">
        <Image
          src={image}
          alt="card-event"
          height={200}
          width={200}
          className="w-full h-[300px] object-cover rounded-2xl"
        />
      </CardHeader>
      <CardContent className="px-3">
        <h1 className="capitalize font-semibold text-xl">{judul}</h1>
        <h4 className="text-muted-foreground text-sm mt-3">
          created by <span className="capitalize">{createdBy}</span>
        </h4>
        <div className="flex items-center text-muted-foreground/80 my-3">
          <div className="flex items-center gap-1.5">
            <IconCalendarWeek className="size-4 " />
            <span className="text-xs font-semibold">Sabtu, {tanggal}</span>
          </div>
          <div className="flex items-center gap-1.5 ">
            <IconMapPin className="size-4 " />
            <span className="text-xs font-semibold">{lokasi}</span>
          </div>
        </div>
        <p className="line-clamp-3 text-xs/5 text-muted-foreground/80">
          {description}
        </p>
      </CardContent>
      <CardFooter className="px-3 pb-3 justify-between">
        <div className="flex -space-x-3">
          {participant.map((user) => (
            <Avatar key={user.image}>
              <AvatarImage
                src={user.image}
                alt="@reui"
                className="border-2 border-background hover:z-10"
              />
              <AvatarFallback className="border-2 border-background hover:z-10">
                CH
              </AvatarFallback>
            </Avatar>
          ))}
          <Button
            variant="secondary"
            className="relative size-10 border-2 border-background hover:z-10 rounded-full text-xs"
          >
            +{totalParticipant}
          </Button>
        </div>
        <Button className="rounded-full text-xs">Daftar Sekarang</Button>
      </CardFooter>
    </Card>
  );
};

export default CardEvent;
