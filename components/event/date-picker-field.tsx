"use client";

import { useState } from "react";
import { addDays, addMonths, addYears } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconCalendar } from "@tabler/icons-react";
import { formattedDate } from "@/utils/date-format";

interface DatePickerFieldProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export const DatePickerField = ({ value, onChange }: DatePickerFieldProps) => {
  const today = new Date();

  const presents = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: addDays(today, 1) },
    { label: "Next week", date: addDays(today, 7) },
    { label: "Next month", date: addMonths(today, 1) },
    { label: "Next year", date: addYears(today, 1) },
  ];

  const [month, setMonth] = useState(today);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group/pick-date w-60 justify-between text-sm"
          variant={"outline"}
        >
          <span className={cn("truncate", value && "")}>
            {value ? formattedDate(value) : "Pick a date"}
          </span>
          <IconCalendar
            strokeWidth={2}
            aria-hidden="true"
            className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0 rounded-4xl">
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="flex">
              <div className="relative py-4 ">
                <div className="h-full border-r-2">
                  <div className="flex flex-col px-2">
                    {presents.map((present) => (
                      <Button
                        key={present.label}
                        className="w-full justify-start capitalize text-xs"
                        onClick={() => {
                          onChange(present.date);
                          setMonth(present.date);
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        {present.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Calendar
                disabled={[{ before: today }]}
                mode="single"
                month={month}
                onMonthChange={setMonth}
                onSelect={onChange}
                selected={value}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
