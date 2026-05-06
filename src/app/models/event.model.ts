export interface SocialEvent {
  id: number;
  title: string;
  location: string;
  date: string;
  capacity: number;
  available: number;
  price: number;
  type: string;
  category: string;
  description: string;
  image: string;
  coordinates: [number, number];
}

export interface CategoryConfig {
  name: string;
  color: string;
  icon: string;
}

export interface ActiveFilters {
  category: string[];
  date: string;
}
