
export enum AppTab {
  DASHBOARD = 'dashboard',
  CONFIG = 'config'
}

export interface ToneOption {
  id: string;
  name: string;
  description: string;
}

export interface AppState {
  selectedTone: string;
  selectedRegions: string[];
  selectedPromotion: string;
  keyDetails: string;
}

export const REGIONS = [
  'Asia', 'Europe', 'United States', 'Middle East', 'New Zealand', 'China', 'Global'
];

export const PROMOTIONS = [
  'New Year Promotion',
  'Chinese New Year Promotion',
  'Summer Promotion',
  'Winter Promotion',
  'Valentine’s Promotion',
  'Autumn Sale',
  'Black Friday',
  'Flash Deal',
  'Loyalty Exclusive'
];

export interface Configuration {
  toneAName: string;
  toneADescription: string;
  toneBName: string;
  toneBDescription: string;
}
