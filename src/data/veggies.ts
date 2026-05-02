import { Vegetable } from '../types';

export const VEGETABLES: Vegetable[] = [
  {
    id: 'v1',
    name: 'Organic Cherry Tomatoes',
    category: 'Marrow',
    price: 120,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1546473427-e1ad00918900?auto=format&fit=crop&q=80&w=800',
    description: 'Sweet and juicy organic cherry tomatoes, perfect for salads and snacking.',
    benefits: ['Rich in Lycopene', 'High Vitamin C', 'Low Calorie'],
    stock: 50
  },
  {
    id: 'v2',
    name: 'Fresh Kale Bunch',
    category: 'Leafy',
    price: 80,
    unit: 'bunch',
    image: 'https://images.unsplash.com/photo-1524179524021-39587f05251a?auto=format&fit=crop&q=80&w=800',
    description: 'Crisp, dark green curly kale, nutrient-dense and versatile.',
    benefits: ['Superfood', 'High Iron', 'Fiber Rich'],
    stock: 30
  },
  {
    id: 'v3',
    name: 'Rainbow Carrots',
    category: 'Root',
    price: 95,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1590865101275-483624df442a?auto=format&fit=crop&q=80&w=800',
    description: 'Vibrant mix of purple, yellow, and orange heirloom carrots.',
    benefits: ['Vitamin A', 'Eye Health', 'Antioxidants'],
    stock: 45
  },
  {
    id: 'v4',
    name: 'Red Bell Peppers',
    category: 'Marrow',
    price: 40,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1563513307168-a4262ed350df?auto=format&fit=crop&q=80&w=800',
    description: 'Fresh, crunchy, and sweet organic red bell peppers.',
    benefits: ['Vitamin C', 'Metabolism Boost', 'Hydrating'],
    stock: 60
  },
  {
    id: 'v5',
    name: 'Purple Cauliflower',
    category: 'Cruciferous',
    price: 150,
    unit: 'head',
    image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&q=80&w=800',
    description: 'Beautiful and healthy purple cauliflower, turns heads and tastes great.',
    benefits: ['Anti-inflammatory', 'Brain Health', 'Unique Look'],
    stock: 15
  },
  {
    id: 'v6',
    name: 'Red Onion',
    category: 'Allium',
    price: 50,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=800',
    description: 'Sharp and crunchy red onions, essential for any kitchen.',
    benefits: ['Heart Health', 'Flavorful', 'Antibacterial'],
    stock: 100
  },
  {
    id: 'v7',
    name: 'Baby Spinach',
    category: 'Leafy',
    price: 60,
    unit: 'pkt',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
    description: 'Tender baby spinach leaves, pre-washed and ready for your recipes.',
    benefits: ['Magnesium', 'Vitamin K', 'Easy to Cook'],
    stock: 40
  },
  {
    id: 'v8',
    name: 'Sweet Potatoes',
    category: 'Root',
    price: 45,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?auto=format&fit=crop&q=80&w=800',
    description: 'Nutritious sweet potatoes with a natural sweetness.',
    benefits: ['Complex Carbs', 'Energy Boost', 'Skin Health'],
    stock: 80
  }
];

export const CATEGORIES: {name: string; icon: string}[] = [
  { name: 'All', icon: 'Leaf' },
  { name: 'Leafy', icon: 'Wind' },
  { name: 'Root', icon: 'Mountain' },
  { name: 'Cruciferous', icon: 'Flower' },
  { name: 'Marrow', icon: 'Zap' },
  { name: 'Allium', icon: 'Activity' }
];
