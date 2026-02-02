"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";

export const SkeletonTable = () => {
  const skeletonRow = [
    { id: 31 },
    { id: 6 },
    { id: 74 },
    { id: 36 },
    { id: 78 },
    { id: 21 },
    { id: 62 },
  ];

  return (
    <TableBody>
      {skeletonRow.map((row) => (
        <TableRow key={row.id}>
          <TableCell>
            <Skeleton className="h-6 w-52" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-52" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-20" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
