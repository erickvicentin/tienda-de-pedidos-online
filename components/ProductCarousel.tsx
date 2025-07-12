// components/ProductCarousel.tsx
import React from 'react';
import Slider from 'react-slick';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  onAddToCart: (product: Product, selectedSize: number, priceForSize: number) => void;
  onImageClick: (imageUrl: string) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, onAddToCart, onImageClick }) => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 5000, // Velocidad de la transición
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Para un movimiento continuo
    cssEase: 'linear', // Transición lineal, sin pausas
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 py-8">
      <Slider {...settings}>
        {products.map(product => (
          <div key={product.id} className="px-2">
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onImageClick={onImageClick}
              showDescription={false}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
