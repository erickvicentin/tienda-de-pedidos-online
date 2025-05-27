import React from 'react';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  genderOptions: string[];
  selectedGender: string;
  onGenderChange: (gender: string) => void;
  authorOptions: string[];
  selectedAuthor: string;
  onAuthorChange: (author: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartItemCount, 
  onCartClick, 
  onLogoClick,
  searchTerm,
  onSearchChange,
  genderOptions,
  selectedGender,
  onGenderChange,
  authorOptions,
  selectedAuthor,
  onAuthorChange
}) => {
  const commonInputClass = "p-2 rounded-md bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary shadow-sm w-full sm:w-auto text-sm placeholder-gray-500";

  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: Logo and Cart */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onLogoClick} className="flex-shrink-0 text-white text-2xl font-bold hover:opacity-80 transition-opacity">
              Millanel Resistencia
            </button>
          </div>
          <div className="flex items-center">
            <button 
              onClick={onCartClick}
              className="relative p-1 rounded-full text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white transition-colors"
              aria-label="Ver carrito"
            >
              <ShoppingCartIcon className="h-7 w-7" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom row: Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 pb-3 pt-1">
          <input
            type="search"
            placeholder="Buscar por nombre o autor..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${commonInputClass} flex-grow`}
            aria-label="Buscar productos"
          />
          <div className="flex space-x-3">
            <select
              value={selectedGender}
              onChange={(e) => onGenderChange(e.target.value)}
              className={`${commonInputClass} sm:min-w-[150px]`}
              aria-label="Filtrar por género"
            >
              {genderOptions.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
            <select
              value={selectedAuthor}
              onChange={(e) => onAuthorChange(e.target.value)}
              className={`${commonInputClass} sm:min-w-[180px]`}
              aria-label="Filtrar por autor"
            >
              {authorOptions.map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
