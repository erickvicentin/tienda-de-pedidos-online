
import { Product, Gender, ProductCategory } from './types';

export const GLOBAL_SIZE_PRICES: { [size: number]: number } = {
  30: 11000.00,
  60: 14000.00,
  100: 20000.00,
};

export const AVAILABLE_PRODUCT_CATEGORIES: ProductCategory[] = ['Fragancia', 'Otra'];

/*
export const MOCK_PRODUCTS: Product[] = [
  {
    "id": "1",
    "name": "Chanel Nº5 N°01",
    "description": "Elegante y floral con notas aldehídicas, un clásico atemporal.",
    "imageUrl": "https://images.pexels.com/photos/1261325/pexels-photo-1261325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "category": "Fragancia",
    "gender": "Femenina",
    "author": "Chanel",
    "sizes": [30, 60, 100]
  },
  // ... (resto de los productos mockeados)
];
*/
