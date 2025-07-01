"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const from = fromParam ? new Date(fromParam) : new Date(new Date().setDate(new Date().getDate() - 29));
  const to = toParam ? new Date(toParam) : new Date();

  const [range, setRange] = useState<DateRange | undefined>({ from, to });

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    
    if (selectedRange?.from && selectedRange?.to) {
      const fromISO = format(selectedRange.from, 'yyyy-MM-dd');
      const toISO = format(selectedRange.to, 'yyyy-MM-dd');
      router.push(`/admin/dashboard?from=${fromISO}&to=${toISO}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal md:w-[300px]",
            !range && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, "d LLL, y")} - {format(range.to, "d LLL, y")}
              </>
            ) : (
              format(range.from, "d LLL, y")
            )
          ) : (
            <span>Pilih tanggal</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-6 shadow-xl rounded-xl" align="end">
        <DayPicker
          initialFocus
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}