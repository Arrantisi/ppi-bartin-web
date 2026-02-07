import { Skeleton } from "../ui/skeleton";
import { TableBody, TableCell, TableRow } from "../ui/table";

const SkeletonSearchUserEvent = () => {
  const skeletonRow = [
    { id: 31 },
    { id: 6 },
    { id: 74 },
    { id: 36 },
    { id: 78 },
    { id: 21 },
    { id: 62 },
    { id: 6962 },
  ];

  return (
    <TableBody>
      {skeletonRow.map((row) => (
        <TableRow key={row.id}>
          <TableCell>
            <Skeleton className="h-11 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default SkeletonSearchUserEvent;
