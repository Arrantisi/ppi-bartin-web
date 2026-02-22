"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

export const SkeletonTable = () => {
  return (
    <TableRow>
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
  );
};
