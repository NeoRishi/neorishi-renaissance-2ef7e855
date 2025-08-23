import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DropdownDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export const DropdownDatePicker = ({ value, onChange, placeholder = "Select date" }: DropdownDatePickerProps) => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  // Initialize from existing value
  useEffect(() => {
    if (value) {
      setDay(value.getDate().toString().padStart(2, '0'));
      setMonth((value.getMonth() + 1).toString().padStart(2, '0'));
      setYear(value.getFullYear().toString());
    }
  }, [value]);

  // Update parent when individual values change
  useEffect(() => {
    if (day && month && year) {
      const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(newDate.getTime())) {
        onChange(newDate);
      }
    } else if (!day && !month && !year) {
      onChange(undefined);
    }
  }, [day, month, year, onChange]);

  const days = Array.from({ length: 31 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    return { value: day, label: day };
  });

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { value: year, label: year };
  });

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select value={day} onValueChange={setDay}>
        <SelectTrigger className="rounded-xl border-muted/50 focus:border-primary/50 bg-background">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="bg-background border-muted/50 max-h-60 z-50">
          {days.map((day) => (
            <SelectItem key={day.value} value={day.value} className="hover:bg-muted/50">
              {day.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={month} onValueChange={setMonth}>
        <SelectTrigger className="rounded-xl border-muted/50 focus:border-primary/50 bg-background">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="bg-background border-muted/50 max-h-60 z-50">
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value} className="hover:bg-muted/50">
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="rounded-xl border-muted/50 focus:border-primary/50 bg-background">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="bg-background border-muted/50 max-h-60 z-50">
          {years.map((year) => (
            <SelectItem key={year.value} value={year.value} className="hover:bg-muted/50">
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};