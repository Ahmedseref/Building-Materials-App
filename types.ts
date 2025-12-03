export interface Product {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  features: string[];
}

export interface PIItem extends Product {
  quantity: number;
  editedImage?: string; // If the user used AI to modify the image
  notes?: string;
}

export interface CustomerDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  piNumber: string;
  date: string;
  validUntil: string;
}

export interface PIVisibilitySettings {
  showManufacturer: boolean;
  showDescription: boolean;
  showImages: boolean;
  showUnit: boolean;
  showNotes: boolean;
}