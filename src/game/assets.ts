import { AssetType, PropertyTier, PropertyType, PropertySize } from './types';

export const ASSETS_FOR_SALE: { 
  type: AssetType; 
  name: string; 
  baseValue: number; 
  rentYield?: number;
  propertyTier?: PropertyTier;
  propertyType?: PropertyType;
  propertySize?: PropertySize;
  maxUpgrades?: number;
}[] = [
  // Properties
  { type: 'Property', name: 'Trailer Home', baseValue: 15000, propertyTier: 'Bad', propertyType: 'House', propertySize: 'Small', maxUpgrades: 3 },
  { type: 'Property', name: 'Studio Apartment', baseValue: 80000, propertyTier: 'Middle Class', propertyType: 'Apartment', propertySize: 'Small', maxUpgrades: 3 },
  { type: 'Property', name: '1-Bedroom Condo', baseValue: 150000, propertyTier: 'Middle Class', propertyType: 'Apartment', propertySize: 'Medium', maxUpgrades: 6 },
  { type: 'Property', name: 'Suburban House', baseValue: 350000, propertyTier: 'Middle Class', propertyType: 'House', propertySize: 'Medium', maxUpgrades: 6 },
  { type: 'Property', name: 'Modern Townhouse', baseValue: 500000, propertyTier: 'Middle Class', propertyType: 'House', propertySize: 'Large', maxUpgrades: 10 },
  { type: 'Property', name: 'Luxury Penthouse', baseValue: 2500000, propertyTier: 'Luxury', propertyType: 'Penthouse', propertySize: 'Large', maxUpgrades: 10 },
  { type: 'Property', name: 'Beachfront Villa', baseValue: 5000000, propertyTier: 'Luxury', propertyType: 'Mansion', propertySize: 'Mansion', maxUpgrades: 20 },
  { type: 'Property', name: 'Mega Mansion', baseValue: 15000000, propertyTier: 'Luxury', propertyType: 'Mansion', propertySize: 'Mansion', maxUpgrades: 20 },
  { type: 'Property', name: 'Private Island Estate', baseValue: 50000000, propertyTier: 'Luxury', propertyType: 'Private Island', propertySize: 'Mansion', maxUpgrades: 20 },
  { type: 'Property', name: 'Small Office Building', baseValue: 1000000, propertyTier: 'Middle Class', propertyType: 'Office', propertySize: 'Large', maxUpgrades: 10 },
  { type: 'Property', name: 'Shopping Mall', baseValue: 25000000, propertyTier: 'Luxury', propertyType: 'Mall', propertySize: 'Mansion', maxUpgrades: 20 },
  { type: 'Property', name: 'Empty Plot of Land', baseValue: 50000, propertyTier: 'Bad', propertyType: 'Land', propertySize: 'Small', maxUpgrades: 0 },

  // Cars
  { type: 'Car', name: 'Toyota Corolla', baseValue: 20000 },
  { type: 'Car', name: 'Honda Civic', baseValue: 22000 },
  { type: 'Car', name: 'Nissan Micra', baseValue: 15000 },
  { type: 'Car', name: 'Kia Rio', baseValue: 16000 },
  { type: 'Car', name: 'Tesla Model 3', baseValue: 40000 },
  { type: 'Car', name: 'BMW 3 Series', baseValue: 45000 },
  { type: 'Car', name: 'Audi A4', baseValue: 42000 },
  { type: 'Car', name: 'Mazda CX-5', baseValue: 30000 },
  { type: 'Car', name: 'Mercedes S-Class', baseValue: 110000 },
  { type: 'Car', name: 'BMW 7 Series', baseValue: 100000 },
  { type: 'Car', name: 'Audi A8', baseValue: 90000 },
  { type: 'Car', name: 'Lamborghini Huracan', baseValue: 250000 },
  { type: 'Car', name: 'Ferrari 488', baseValue: 280000 },
  { type: 'Car', name: 'McLaren 720S', baseValue: 300000 },
  { type: 'Car', name: 'Bugatti Chiron', baseValue: 3000000 },
  { type: 'Car', name: 'Rolls-Royce Phantom', baseValue: 450000 },

  // Boats
  { type: 'Boat', name: 'Rowboat', baseValue: 1000 },
  { type: 'Boat', name: 'Speedboat', baseValue: 30000 },
  { type: 'Boat', name: 'Cabin Cruiser', baseValue: 150000 },
  { type: 'Boat', name: 'Luxury Yacht', baseValue: 2000000 },
  { type: 'Boat', name: 'Super Yacht', baseValue: 25000000 },
  { type: 'Boat', name: 'Mega Yacht', baseValue: 150000000 },

  // Planes
  { type: 'Plane', name: 'Single-Engine Propeller', baseValue: 50000 },
  { type: 'Plane', name: 'Twin-Engine Turboprop', baseValue: 500000 },
  { type: 'Plane', name: 'Light Jet', baseValue: 3000000 },
  { type: 'Plane', name: 'Midsize Jet', baseValue: 12000000 },
  { type: 'Plane', name: 'Heavy Jet', baseValue: 35000000 },
  { type: 'Plane', name: 'Luxury Airliner', baseValue: 100000000 },

  // Crypto
  { type: 'Crypto', name: '100 DogeCoin', baseValue: 10 },
  { type: 'Crypto', name: '1 Ethereum', baseValue: 2500 },
  { type: 'Crypto', name: '1 Bitcoin', baseValue: 60000 },
  { type: 'Crypto', name: '10 Bitcoin', baseValue: 600000 },

  // Lifestyle
  { type: 'Lifestyle', name: 'TV', baseValue: 500 },
  { type: 'Lifestyle', name: 'Gaming Setup', baseValue: 2500 },
  { type: 'Lifestyle', name: 'Home Gym', baseValue: 5000 },
  { type: 'Lifestyle', name: 'Pool', baseValue: 30000 },
  { type: 'Lifestyle', name: 'Smart Home System', baseValue: 15000 },
  { type: 'Lifestyle', name: 'Console', baseValue: 400 },
  { type: 'Lifestyle', name: 'PC Setup', baseValue: 2000 },
  { type: 'Lifestyle', name: 'VR Headset', baseValue: 500 },
  { type: 'Lifestyle', name: 'Streaming Setup', baseValue: 1500 },
  { type: 'Lifestyle', name: 'Books', baseValue: 100 },
  { type: 'Lifestyle', name: 'Courses', baseValue: 500 },
  { type: 'Lifestyle', name: 'Coaching', baseValue: 2000 },
  { type: 'Lifestyle', name: 'Designer Clothes', baseValue: 5000 },
  { type: 'Lifestyle', name: 'Watches', baseValue: 10000 },
  { type: 'Lifestyle', name: 'Jewelry', baseValue: 15000 },
];
