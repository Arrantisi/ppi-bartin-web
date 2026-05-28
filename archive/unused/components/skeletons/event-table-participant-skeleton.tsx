import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

export const EventTableParticipantSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-10 w-full" />
      </TableCell>
    </TableRow>
  );
};
