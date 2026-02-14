
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  rating: number;
  image: string;
  location: string;
  specialties: string[];
}

export interface Dish {
  id: string;
  name: string;
  restaurantName: string;
  price: string;
  image: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}
