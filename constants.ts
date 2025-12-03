import { Product, CustomerDetails } from './types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Porcelain Floor Tile',
    category: 'Flooring',
    manufacturer: 'Ceramica Deluxe',
    price: 45.00,
    unit: 'sqm',
    image: 'https://picsum.photos/400/400?random=1',
    description: 'High-traffic resistant, matte finish porcelain tiles suitable for commercial and residential use.',
    features: ['Anti-slip', 'Frost resistant', 'Rectified edges']
  },
  {
    id: '2',
    name: 'Structural Steel I-Beam',
    category: 'Structural',
    manufacturer: 'SteelCo Industries',
    price: 120.50,
    unit: 'meter',
    image: 'https://picsum.photos/400/400?random=2',
    description: 'Heavy-duty structural steel beams for framing and support. ASTM A992 grade.',
    features: ['High tensile strength', 'Corrosion resistant coating']
  },
  {
    id: '3',
    name: 'Portland Cement Type I',
    category: 'Cement',
    manufacturer: 'BuildRight Cement',
    price: 12.00,
    unit: 'bag (50kg)',
    image: 'https://picsum.photos/400/400?random=3',
    description: 'General purpose cement for concrete, mortar, and stucco.',
    features: ['Fast setting', 'High durability']
  },
  {
    id: '4',
    name: 'Tempered Glass Panel',
    category: 'Glazing',
    manufacturer: 'ClearView Glass',
    price: 85.00,
    unit: 'sqm',
    image: 'https://picsum.photos/400/400?random=4',
    description: '10mm thick clear tempered glass for facades and partitions.',
    features: ['Safety glass', 'Thermal insulation']
  },
  {
    id: '5',
    name: 'Acoustic Ceiling Tile',
    category: 'Ceiling',
    manufacturer: 'SoundBlock',
    price: 18.25,
    unit: 'piece',
    image: 'https://picsum.photos/400/400?random=5',
    description: 'Mineral fiber ceiling tiles designed to reduce noise and improve acoustics.',
    features: ['NRC 0.70', 'Fire rated class A']
  },
  {
    id: '6',
    name: 'Teak Wood Cladding',
    category: 'Wood',
    manufacturer: 'NatureWood',
    price: 150.00,
    unit: 'sqm',
    image: 'https://picsum.photos/400/400?random=6',
    description: 'Sustainably sourced teak wood for exterior and interior wall cladding.',
    features: ['Termite resistant', 'Natural finish']
  }
];

export const INITIAL_CUSTOMER: CustomerDetails = {
  name: 'John Architect',
  company: 'Modern Builds Ltd.',
  email: 'john@modernbuilds.com',
  phone: '+1 (555) 123-4567',
  address: '123 Construction Ave, Builder City, BC 90210',
  piNumber: `PI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};