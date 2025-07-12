// components/ProductCarousel.tsx
import React from 'react';
import Slider from 'react-slick';
import { Product } from '../types';
import CarouselCard from './CarouselCard'; // Importar la nueva tarjeta

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
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
    <div className="w-full py-8">
      <Slider {...settings}>
        {products.map(product => (
          <div key={product.id}>
            <CarouselCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
