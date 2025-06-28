"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRouter, useSearchParams } from 'next/navigation';

export function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date(new Date().setDate(new Date().getDate() - 29));
  const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : new Date();

  const [range, setRange] = useState({ from, to });

  const handleSelect = (selectedRange: any) => {
    if (selectedRange?.from && selectedRange?.to) {
      setRange(selectedRange);
      const fromISO = format(selectedRange.from, 'yyyy-MM-dd');
      const toISO = format(selectedRange.to, 'yyyy-MM-dd');
      router.push(`/admin/dashboard?from=${fromISO}&to=${toISO}`);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="font-semibold mb-2 text-center text-dark-green">Pilih Rentang Tanggal</p>
      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </div>
      <p className="text-center text-sm text-text-main/80 mt-2">
        Menampilkan data dari <span className="font-semibold">{format(range.from, "d MMM yyyy")}</span> hingga <span className="font-semibold">{format(range.to, "d MMM yyyy")}</span>.
      </p>
    </div>
  );
}