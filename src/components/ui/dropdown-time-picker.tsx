import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DropdownTimePickerProps {
  value?: string;
  onChange: (time: string | undefined) => void;
  placeholder?: string;
}

export const DropdownTimePicker = ({ value, onChange, placeholder = "Select time" }: DropdownTimePickerProps) => {
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');
  const [period, setPeriod] = useState<string>('');

  // Initialize from existing value
  useEffect(() => {
    if (value) {
      const [time] = value.split('.');
      const [h, m] = time.split(':');
      const hourNum = parseInt(h);
      
      if (hourNum === 0) {
        setHour('12');
        setPeriod('AM');
      } else if (hourNum <= 12) {
        setHour(hourNum.toString());
        setPeriod('AM');
      } else {
        setHour((hourNum - 12).toString());
        setPeriod('PM');
      }
      
      setMinute(m);
    }
  }, [value]);

  // Update parent when individual values change
  useEffect(() => {
    if (hour && minute && period) {
      let hour24 = parseInt(hour);
      
      if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      } else if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      }
      
      const timeString = `${hour24.toString().padStart(2, '0')}:${minute}:00`;
      onChange(timeString);
    } else if (!hour && !minute && !period) {
      onChange(undefined);
    }
  }, [hour, minute, period, onChange]);

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString();
    return { value: hour, label: hour };
  });

  const minutes = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, '0');
    return { value: minute, label: minute };
  });

  const periods = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select value={hour} onValueChange={setHour}>
        <SelectTrigger className="rounded-xl border-muted/50 focus:border-primary/50 bg-background">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent className="bg-background border-muted/50 max-h-60 z-50">
          {hours.map((hour) => (
            <SelectItem key={hour.value} value={hour.value} className="hover:bg-muted/50">
              {hour.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={minute} onValueChange={setMinute}>
        <SelectTrigger className="rounded-xl border-muted/50 focus:border-primary/50 bg-background">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className="bg-background border-muted/50 max-h-60 z-50">
          {minutes.map((minute) => (
            <SelectItem key={minute.value} value={minute.value} className="hover:bg-muted/50">
              {minute.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="rounded-xl border-muted/50 focus:border-primary/50 bg-background">
          <SelectValue placeholder="AM/PM" />
        </SelectTrigger>
        <SelectContent className="bg-background border-muted/50 z-50">
          {periods.map((period) => (
            <SelectItem key={period.value} value={period.value} className="hover:bg-muted/50">
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};