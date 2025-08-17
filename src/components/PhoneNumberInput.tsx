import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryCodes } from '@/utils/countryCodes';
import { cn } from '@/lib/utils';

interface PhoneNumberInputProps {
  country: string;
  onCountryChange: (value: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  country,
  onCountryChange,
  phoneNumber,
  onPhoneNumberChange,
  required,
  className,
}) => {
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and limit to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      onPhoneNumberChange(value);
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      <Select value={country} onValueChange={onCountryChange}>
        <SelectTrigger className="w-[120px] rounded-r-none">
          <SelectValue placeholder="Country code" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.name} ({c.dial_code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="Phone number"
        required={required}
        className="rounded-l-none"
        pattern="\d*"
        maxLength={10}
      />
    </div>
  );
}; 