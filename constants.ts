

import { Product, Gender, ProductCategory, OrderStatus } from './types';

export const GLOBAL_SIZE_PRICES: { [size: number]: number } = {
  30: 12000.00,
  60: 16000.00,
  100: 22000.00,
  // 0: 5000.00, // Removed: Size 0 pricing is deprecated; use manualPrice for non-fragrances.
};

export const AVAILABLE_PRODUCT_CATEGORIES: ProductCategory[] = ['Fragancia', 'Cosmética', 'Accesorio', 'Bazar', 'Otra'];
export const ORDER_STATUS_OPTIONS: OrderStatus[] = ['Pendiente', 'Confirmado', 'Retirado', 'Entregado', 'Pagado', 'Cancelado'];

export const MOCK_PRODUCTS: Product[] = [
  {
    "id": "1",
    "name": "Bella (La Vie Est Belle)",
    "description": "Fragancia femenina dulce y elegante con notas de iris, pachulí y vainilla. Ideal para la mujer sofisticada.",
    "imageUrl": "https://d3ugyo2v2k9elm.cloudfront.net/stores/001/780/347/products/la-vida-es-bella1-1ac79a3d7d71f1020716469549575400-1024-1024.jpg",
    "category": "Fragancia",
    "gender": "Femenina",
    "author": "Millanel",
    "sizes": [30, 60, 100],
    "isVisible": true
  },
  {
    "id": "2",
    "name": "Blue Spirit (Bleu)",
    "description": "Aroma masculino amaderado y fresco con toques cítricos y de jengibre. Para el hombre moderno y audaz.",
    "imageUrl": "https://www.consultoramilagros.com.ar/wp-content/uploads/2022/05/133-BLEU-DE-CHANEL.jpg",
    "category": "Fragancia",
    "gender": "Masculina",
    "author": "Millanel",
    "sizes": [30, 60, 100],
    "isVisible": true
  },
  {
    "id": "3",
    "name": "Sweet Baby (Scandal)",
    "description": "Perfume femenino chipre floral con miel y gardenia. Provocador y sensual.",
    "imageUrl": "https://http2.mlstatic.com/D_NQ_NP_894201-MLA47668997892_092021-O.webp",
    "category": "Fragancia",
    "gender": "Femenina",
    "author": "Millanel",
    "sizes": [60, 100],
    "isVisible": true
  },
  {
    "id": "4",
    "name": "Olimpo (Olympéa)",
    "description": "Fragancia oriental fresca para mujer, con vainilla salada y mandarina verde. Divina y poderosa.",
    "imageUrl": "https://cdn.sanity.io/images/4gmskbhr/production/c88947f2143757f849adaa818369947793175335-990x990.jpg?w=1000&h=1000&fit=max",
    "category": "Fragancia",
    "gender": "Femenina",
    "author": "Millanel",
    "sizes": [30, 60],
    "isVisible": true
  },
  {
    "id": "5",
    "name": "Invencible (Invictus)",
    "description": "Aroma masculino acuático amaderado, con notas marinas y pomelo. Vibrante y energizante.",
    "imageUrl": "https://http2.mlstatic.com/D_NQ_NP_600616-MLA70478156299_072023-O.webp",
    "category": "Fragancia",
    "gender": "Masculina",
    "author": "Millanel",
    "sizes": [60, 100],
    "isVisible": true
  },
  {
    "id": "6",
    "name": "Labial Matte Larga Duración",
    "description": "Labial con acabado matte y color intenso que perdura. Varios tonos disponibles.",
    "imageUrl": "https://www.millanel.com/wp-content/uploads/2022/07/pagina-labiales-matte-2022.jpg",
    "category": "Cosmética",
    "gender": "Femenina",
    "author": "Millanel Cosmética",
    "sizes": [],
    "manualPrice": 5000.00,
    "isVisible": true
  },
  {
    "id": "7",
    "name": "Delineador Líquido Negro Intenso",
    "description": "Delineador líquido de alta precisión para una mirada impactante. A prueba de agua.",
    "imageUrl": "https://www.millanel.com/wp-content/uploads/2019/02/delineadorliquidoapruebadeagua.jpg",
    "category": "Cosmética",
    "gender": "Unisex",
    "author": "Millanel Cosmética",
    "sizes": [],
    "manualPrice": 3500.00,
    "isVisible": true
  },
  {
    "id": "8",
    "name": "Crema Hidratante Facial Día",
    "description": "Crema facial con ácido hialurónico y FPS 15. Hidratación profunda y protección solar.",
    "imageUrl": "https://www.millanel.com/wp-content/uploads/2021/10/VITAE-hidratante-de-dia.jpg",
    "category": "Cosmética",
    "gender": "Unisex",
    "author": "Millanel Cuidado Personal",
    "sizes": [50],
    "manualPrice": 7000.00,
    "isVisible": true
  }
];
