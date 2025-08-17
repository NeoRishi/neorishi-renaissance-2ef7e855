export type DoshaType = 'Vata' | 'Pitta' | 'Kapha';
export type ConstitutionType = DoshaType | `${DoshaType}-${DoshaType}`;

export interface PrakritiResult {
  vata: number;
  pitta: number;
  kapha: number;
  dominantDosha: DoshaType;
  secondaryDosha: DoshaType;
  constitution: ConstitutionType;
} 