import { UserData } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export const columnsUserEvet: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const imageUrl = row.original.image as string;
      const email = row.original.email;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-9">
            <AvatarImage src={imageUrl} alt={name || ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-semibold">{name}</span>
            <span className="text-xs text-foreground/80">{email}</span>
          </div>
        </div>
      );
    },
  },
];
