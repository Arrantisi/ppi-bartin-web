"use client";

import {
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  startOfYear,
} from "date-fns";
import type { CaptionLabelProps, MonthGridProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarBlankIcon, CaretDownIcon } from "@phosphor-icons/react";
import { formattedDate } from "@/utils/date-format";

export function TanggalLahitField({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}) {
  const today = new Date();
  const [month, setMonth] = useState(today);
  const [isYearView, setIsYearView] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const startYear = today.getFullYear() - 30;
  const endYear = today.getFullYear() + 2;
  const startDate = startOfYear(new Date(startYear, 0));
  const endDate = endOfYear(new Date(endYear, 11));

  const years = eachYearOfInterval({
    end: endOfYear(endDate),
    start: startOfYear(startDate),
  });

  return (
    <Popover>
      <PopoverTrigger
        className={buttonVariants({
          variant: "outline",
          className:
            "group/pick-date w-full justify-between rounded-xl text-[14px]",
        })}
      >
        <span className={cn("truncate", value && "text-muted-foreground")}>
          {value ? formattedDate(value) : "Pick a date"}
        </span>
        <CalendarBlankIcon
          strokeWidth={2}
          aria-hidden="true"
          className="group-hover:text-foreground shrink-0 transition-colors"
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Card className="p-0">
          <CardContent className="p-0">
            <Calendar
              classNames={{
                month_caption: "justify-start",
                nav: "flex items-center w-full absolute inset-x-0 justify-end pointer-events-none [&>button]:pointer-events-auto",
              }}
              components={{
                CaptionLabel: (props: CaptionLabelProps) => (
                  <CaptionLabel
                    isYearView={isYearView}
                    setIsYearView={(val) => {
                      setIsYearView(val);
                      if (!val) setSelectedYear(null);
                    }}
                    {...props}
                  />
                ),
                MonthGrid: (props: MonthGridProps) => {
                  return (
                    <MonthGrid
                      className={props.className}
                      currentMonth={month.getMonth()}
                      currentYear={month.getFullYear()}
                      endDate={endDate}
                      isYearView={isYearView}
                      onMonthSelect={(selectedMonth: Date) => {
                        setMonth(selectedMonth);
                        setIsYearView(false);
                        setSelectedYear(null);
                      }}
                      setIsYearView={setIsYearView}
                      startDate={startDate}
                      years={years}
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                    >
                      {props.children}
                    </MonthGrid>
                  );
                },
              }}
              defaultMonth={new Date()}
              endMonth={endDate}
              mode="single"
              month={month}
              onMonthChange={setMonth}
              onSelect={onChange}
              selected={value}
              startMonth={startDate}
            />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

function MonthGrid({
  className,
  children,
  isYearView,
  years,
  currentYear,
  currentMonth,
  onMonthSelect,
  selectedYear,
  setSelectedYear,
  startDate,
  endDate,
}: {
  className?: string;
  children: ReactNode;
  isYearView: boolean;
  setIsYearView: Dispatch<SetStateAction<boolean>>;
  startDate: Date;
  endDate: Date;
  years: Date[];
  currentYear: number;
  currentMonth: number;
  onMonthSelect: (date: Date) => void;
  selectedYear: number | null;
  setSelectedYear: Dispatch<SetStateAction<number | null>>;
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isYearView && scrollAreaRef.current) {
      const activeElement = scrollAreaRef.current.querySelector(
        "[data-active='true']",
      ) as HTMLElement | null;

      if (activeElement) {
        activeElement.scrollIntoView({ block: "center" });
      }
    }
  }, [isYearView, selectedYear]);

  return (
    <div className="relative">
      <table className={className}>{children}</table>
      {isYearView && (
        <div className="bg-background absolute inset-0 z-20 -m-2">
          <div className="h-full" ref={scrollAreaRef}>
            <ScrollArea className="h-full">
              <div className="px-3 pt-1 pb-3">
                {selectedYear === null ? (
                  <div className="grid grid-cols-4 gap-2">
                    {years.map((year) => {
                      const y = year.getFullYear();
                      const isCurrent = y === currentYear;
                      return (
                        <Button
                          key={y}
                          variant={isCurrent ? "default" : "outline"}
                          size="sm"
                          className="h-8"
                          data-active={isCurrent}
                          onClick={() => setSelectedYear(y)}
                        >
                          {y}
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2"
                        onClick={() => setSelectedYear(null)}
                      >
                        <CaretDownIcon
                          strokeWidth={2}
                          className="mr-1 size-4 rotate-90"
                        />
                        {selectedYear}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {eachMonthOfInterval({
                        start: startOfYear(new Date(selectedYear, 0)),
                        end: endOfYear(new Date(selectedYear, 0)),
                      }).map((month) => {
                        const isCurrent =
                          month.getMonth() === currentMonth &&
                          selectedYear === currentYear;

                        const isDisabled =
                          isBefore(month, startOfYear(startDate)) ||
                          isAfter(month, endOfYear(endDate));

                        return (
                          <Button
                            key={month.getTime()}
                            variant={isCurrent ? "default" : "outline"}
                            size="sm"
                            className="h-8"
                            data-active={isCurrent}
                            disabled={isDisabled}
                            onClick={() => onMonthSelect(month)}
                          >
                            {format(month, "MMM")}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}

function CaptionLabel({
  children,
  isYearView,
  setIsYearView,
}: {
  isYearView: boolean;
  setIsYearView: Dispatch<SetStateAction<boolean>>;
} & HTMLAttributes<HTMLSpanElement>) {
  return (
    <Button
      className="data-[state=open]:text-muted-foreground/80 -ms-2 flex items-center gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
      data-state={isYearView ? "open" : "closed"}
      onClick={() => setIsYearView((prev) => !prev)}
      size="sm"
      variant="ghost"
    >
      {children}
      <CaretDownIcon
        strokeWidth={2}
        aria-hidden="true"
        className="text-muted-foreground/80 shrink-0 transition-transform duration-200"
      />
    </Button>
  );
}
