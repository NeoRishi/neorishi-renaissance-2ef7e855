import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export const formatPhoneNumber = (phone: string, countryCode: CountryCode = 'US') => {
  try {
    const phoneNumber = parsePhoneNumber(phone, countryCode);
    return phoneNumber ? phoneNumber.formatInternational() : phone;
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return phone;
  }
};

export const validatePhoneNumber = (phone: string, countryCode: CountryCode = 'US') => {
  try {
    return isValidPhoneNumber(phone, countryCode);
  } catch (error) {
    console.error('Error validating phone number:', error);
    return false;
  }
};

export const normalizePhoneNumber = (phone: string, countryCode: CountryCode = 'US') => {
  try {
    console.log('Normalizing phone number:', phone, 'with country code:', countryCode);
    const phoneNumber = parsePhoneNumber(phone, countryCode);
    const normalized = phoneNumber ? phoneNumber.number : phone;
    console.log('Normalized phone number:', normalized);
    return normalized;
  } catch (error) {
    console.error('Error normalizing phone number:', error);
    return phone;
  }
};

export const getPhoneNumberError = (phone: string, countryCode: CountryCode = 'US'): string | null => {
  if (!phone) return 'Phone number is required';
  
  try {
    console.log('Validating phone number:', phone, 'with country code:', countryCode);
    const phoneNumber = parsePhoneNumber(phone, countryCode);
    if (!phoneNumber) return 'Invalid phone number format';
    if (!phoneNumber.isValid()) return 'Invalid phone number';
    console.log('Phone number is valid:', phoneNumber.formatInternational());
    return null;
  } catch (error) {
    console.error('Error validating phone number:', error);
    return 'Invalid phone number format';
  }
}; 