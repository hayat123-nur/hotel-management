
import { Restaurant, Dish, DocumentInfo } from './types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Kuriftu Resort & Spa Adama',
    description: 'Luxury dining experience with a stunning lake view and exquisite international cuisine.',
    rating: 4.8,
    image: 'https://picsum.photos/seed/kuriftu/800/600',
    location: 'Lake Bishoftu Area',
    specialties: ['Grilled Salmon', 'Lamb Ribs', 'Wine Selection']
  },
  {
    id: '2',
    name: 'Yirgalem Restaurant',
    description: 'Famous for traditional Ethiopian coffee ceremony and authentic local breakfast dishes.',
    rating: 4.5,
    image: 'https://picsum.photos/seed/yirgalem/800/600',
    location: 'Central Adama',
    specialties: ['Chechebsa', 'Special Foul', 'Organic Coffee']
  },
  {
    id: '3',
    name: 'Sodere Resort Restaurant',
    description: 'Enjoy a meal in the lush greenery of the hot springs resort. Perfect for families.',
    rating: 4.2,
    image: 'https://picsum.photos/seed/sodere/800/600',
    location: 'Sodere, 25km from Adama',
    specialties: ['Fish Cutlet', 'Ethiopian Beyaynetu']
  },
  {
    id: '4',
    name: 'Adama German Hotel',
    description: 'A blend of European standards and Ethiopian hospitality. Great steaks and pizza.',
    rating: 4.6,
    image: 'https://picsum.photos/seed/german/800/600',
    location: 'Bole Road',
    specialties: ['Beef Steak', 'Quattro Formaggi Pizza']
  }
];

export const MOCK_DISHES: Dish[] = [
  {
    id: 'd1',
    name: 'Special Kitfo',
    restaurantName: 'Local Favorites',
    price: '350 ETB',
    image: 'https://picsum.photos/seed/kitfo/400/400',
    description: 'Freshly minced lean beef mixed with mitmita and niter kibbeh.'
  },
  {
    id: 'd2',
    name: 'Sodere Tilapia',
    restaurantName: 'Sodere Resort',
    price: '280 ETB',
    image: 'https://picsum.photos/seed/fish/400/400',
    description: 'Freshly caught and grilled tilapia from the local waters.'
  },
  {
    id: 'd3',
    name: 'Adama Special Foul',
    restaurantName: 'Yirgalem',
    price: '120 ETB',
    image: 'https://picsum.photos/seed/foul/400/400',
    description: 'Mashed fava beans with olive oil, chopped onions, and green peppers.'
  }
];

export const MOCK_DOCUMENTS: DocumentInfo[] = [
  { id: 'doc1', name: 'adama_food_guide_2024.pdf', type: 'PDF', uploadDate: '2024-03-15', size: '2.4 MB' },
  { id: 'doc2', name: 'restaurant_menus_compiled.txt', type: 'TXT', uploadDate: '2024-03-20', size: '156 KB' },
  { id: 'doc3', name: 'tourist_favorites_data.csv', type: 'CSV', uploadDate: '2024-03-22', size: '1.1 MB' }
];
