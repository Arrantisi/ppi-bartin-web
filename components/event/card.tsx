import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { IconCalendarWeek, IconMapPin } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const CardEvent = () => {
  return (
    <Card className="py-2 shadow-2xl">
      <CardHeader className="px-2">
        <Image
          src={"/card-event-01.jpeg"}
          alt="card-event"
          height={200}
          width={200}
          className="w-full h-[300px] object-cover rounded-2xl"
        />
      </CardHeader>
      <CardContent className="px-3">
        <h1 className="capitalize font-semibold text-xl">
          pelatihan public speaking
        </h1>
        <h4 className="text-muted-foreground text-sm mt-3">
          created by <span className="capitalize">otong subrono</span>
        </h4>
        <div className="flex items-center text-muted-foreground/80 my-3">
          <div className="flex items-center gap-1.5">
            <IconCalendarWeek className="size-4 " />
            <span className="text-xs font-semibold">Sabtu, 15 Maret 2026</span>
          </div>
          <div className="flex items-center gap-1.5 ">
            <IconMapPin className="size-4 " />
            <span className="text-xs font-semibold">Aula Kampus</span>
          </div>
        </div>
        <p className="line-clamp-3 text-xs/5 text-muted-foreground/80">
          brave dark verb too court memory open excellent morning fought salmon
          soap birds chain describe story different base pass addition wind
          visit record runningopposite stood train store action branch winter
          because merely idea breakfast chief vessels noun pocket start secret
          everybody phrase tone was rise wire air
        </p>
      </CardContent>
      <CardFooter className="px-3 pb-3">
        <div className="flex -space-x-3">
          <Avatar>
            <AvatarImage
              src="/user-profile-02.png"
              alt="@reui"
              className="border-2 border-background hover:z-10"
            />
            <AvatarFallback className="border-2 border-background hover:z-10">
              CH
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="/user-profile-03.png"
              alt="@reui"
              className="border-2 border-background hover:z-10"
            />
            <AvatarFallback className="border-2 border-background hover:z-10">
              CH
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="/user-profile-04.png"
              alt="@reui"
              className="border-2 border-background hover:z-10"
            />
            <AvatarFallback className="border-2 border-background hover:z-10">
              CH
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="/user-profile-05.png"
              alt="@reui"
              className="border-2 border-background hover:z-10"
            />
            <AvatarFallback className="border-2 border-background hover:z-10">
              CH
            </AvatarFallback>
          </Avatar>
          <Button
            variant="secondary"
            className="relative size-10 border-2 border-background hover:z-10 rounded-full"
          >
            +7
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardEvent;
