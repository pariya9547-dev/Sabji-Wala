export interface Vegetable {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  benefits: string[];
  stock: number;
}

export interface CartItem extends Vegetable {
  quantity: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    mobile: string;
    address: string;
    pincode: string;
  };
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any; // Firestore Timestamp
  paymentMethod: string;
}

export type Category = 'All' | 'Leafy' | 'Root' | 'Cruciferous' | 'Marrow' | 'Allium';
