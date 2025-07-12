

import React, { useState, useEffect, FormEvent } from 'react';
import { Product, AppAction, Gender, ProductCategory } from '../../types';
import { AVAILABLE_PRODUCT_CATEGORIES } from '../../constants';
import LoadingSpinner from '../LoadingSpinner'; // Para el botón

interface ProductFormProps {
  product: Product | null;
  onSave: (productData: Product | Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

interface ProductFormState {
  id: string | undefined;
  name: string;
  description: string;
  imageUrl: string;
  category: ProductCategory;
  gender: Gender;
  author: string;
  sizes: number[];
  manualPrice: string;
  isVisible: boolean; // Nuevo campo
}

// Define a dedicated type for form errors
interface ProductFormErrors {
  name?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  gender?: string;
  author?: string;
  sizes?: string;
  manualPrice?: string;
  // No se necesita error para isVisible, ya que es un booleano
}

const newProductInitialState: ProductFormState = {
  id: undefined,
  name: '',
  description: '',
  imageUrl: '',
  category: 'Fragancia',
  gender: 'Unisex',
  author: '',
  sizes: [],
  manualPrice: '',
  isVisible: true, // Por defecto visible
};

const STANDARD_FRAGRANCE_SIZES = [30, 60, 100];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<ProductFormState>(
    product ?
      {
        ...product,
        id: product.id,
        manualPrice: product.manualPrice !== undefined ? String(product.manualPrice) : '',
        isVisible: product.isVisible !== undefined ? product.isVisible : true, // Manejar visibilidad
      } :
      newProductInitialState
  );

  const [sizesInput, setSizesInput] = useState(product?.sizes.join(', ') || '');
  const [formErrors, setFormErrors] = useState<ProductFormErrors>({});

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        manualPrice: product.manualPrice !== undefined ? String(product.manualPrice) : '',
        isVisible: product.isVisible !== undefined ? product.isVisible : true, // Manejar visibilidad
      });
      if (product.category !== 'Fragancia') {
        setSizesInput(product.sizes.join(', '));
      } else {
        setSizesInput('');
      }
    } else {
      setFormData(newProductInitialState);
      setSizesInput('');
    }
    setFormErrors({});
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value as any
    }));

    if (formErrors[name as keyof ProductFormErrors]) {
      setFormErrors(prev => ({ ...prev, [name as keyof ProductFormErrors]: undefined }));
    }
    if (name === 'category') {
      setFormErrors(prev => ({ ...prev, manualPrice: undefined, sizes: undefined }));
      if (value !== 'Fragancia') {
        setSizesInput(formData.sizes.join(', '));
      } else {
        setSizesInput('');
      }
    }
  };

  const handleSizesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizesInput(e.target.value);
    if (formErrors.sizes) {
      setFormErrors(prev => ({ ...prev, sizes: undefined }));
    }
  };

  const handleFragranceSizeToggle = (size: number) => {
    setFormData(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b);
      return { ...prev, sizes: newSizes };
    });
    if (formErrors.sizes) {
      setFormErrors(prev => ({ ...prev, sizes: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ProductFormErrors = {};
    if (!formData.name.trim()) errors.name = "El nombre es obligatorio.";
    if (!formData.author.trim()) errors.author = "El autor es obligatorio.";
    if (!formData.description.trim()) errors.description = "La descripción es obligatoria.";
    if (!formData.imageUrl.trim()) {
      errors.imageUrl = "La URL de la imagen es obligatoria.";
    } else {
      try {
        new URL(formData.imageUrl);
      } catch (_) {
        errors.imageUrl = "La URL de la imagen no es válida.";
      }
    }

    if (formData.category !== 'Fragancia') {
      if (!formData.manualPrice.trim()) {
        errors.manualPrice = "El precio manual es obligatorio para esta categoría.";
      } else {
        const priceNum = parseFloat(formData.manualPrice);
        if (isNaN(priceNum) || priceNum <= 0) {
          errors.manualPrice = "El precio manual debe ser un número positivo.";
        }
      }
      const parsedSizes = sizesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
      if (parsedSizes.length === 0 && sizesInput.trim() !== '' && !parsedSizes.includes(0)) {
        errors.sizes = "Los tamaños/pesos deben ser números positivos (o cero) separados por comas, o dejar vacío.";
      }
    } else {
      if (formData.sizes.length === 0) {
        errors.sizes = "Al menos un tamaño debe ser seleccionado para fragancias.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    let finalSizes: number[];
    if (formData.category === 'Fragancia') {
      finalSizes = formData.sizes;
    } else {
      finalSizes = sizesInput.split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n >= 0);
    }

    const manualPriceNum = formData.category !== 'Fragancia' && formData.manualPrice.trim() !== '' ? parseFloat(formData.manualPrice) : undefined;

    const productDataFields: Omit<Product, 'id'> = {
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl,
      category: formData.category,
      gender: formData.gender,
      author: formData.author,
      sizes: finalSizes,
      isVisible: formData.isVisible, // Añadir visibilidad
      ...(manualPriceNum !== undefined && { manualPrice: manualPriceNum }),
    };

    if (formData.id) {
      const productToSave: Product = {
        ...productDataFields,
        id: formData.id,
      };
      await onSave(productToSave);
    } else {
      await onSave(productDataFields);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const errorClass = "text-red-500 text-xs mt-1";
  const isFragrance = formData.category === 'Fragancia';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {formData.id ? 'Editar Producto' : 'Añadir Nuevo Producto'}
      </h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClass} />
        {formErrors.name && <p className={errorClass}>{formErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Autor</label>
        <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} className={inputClass} />
        {formErrors.author && <p className={errorClass}>{formErrors.author}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className={inputClass} />
        {formErrors.description && <p className={errorClass}>{formErrors.description}</p>}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass} />
        {formErrors.imageUrl && <p className={errorClass}>{formErrors.imageUrl}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select name="category" id="category" value={formData.category} onChange={handleChange} className={inputClass}>
            {AVAILABLE_PRODUCT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
            <option value="Femenina">Femenina</option>
            <option value="Masculina">Masculina</option>
            <option value="Unisex">Unisex</option>
            <option value="Infantil">Infantil</option>
          </select>
        </div>
      </div>

      {!isFragrance && (
        <div>
          <label htmlFor="manualPrice" className="block text-sm font-medium text-gray-700">Precio Manual ($)</label>
          <input
            type="number"
            name="manualPrice"
            id="manualPrice"
            value={formData.manualPrice}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: 5000"
            step="0.01"
          />
          {formErrors.manualPrice && <p className={errorClass}>{formErrors.manualPrice}</p>}
          <p className="text-xs text-gray-500 mt-1">Obligatorio si la categoría no es Fragancia. Ingrese el precio final del producto.</p>
        </div>
      )}

      {isFragrance ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tamaños Disponibles (ml)
          </label>
          <div className="flex space-x-2 flex-wrap gap-y-2 mt-2">
            {STANDARD_FRAGRANCE_SIZES.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => handleFragranceSizeToggle(size)}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors
                  ${formData.sizes.includes(size)
                    ? 'bg-primary text-white border-primary ring-2 ring-primary ring-offset-1'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
              >
                {size}ml
              </button>
            ))}
          </div>
          {formErrors.sizes && <p className={errorClass}>{formErrors.sizes}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Seleccione los tamaños disponibles para esta fragancia (30ml, 60ml, 100ml).
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">
            Tamaños/Pesos (informativo, separados por coma)
          </label>
          <input
            type="text"
            name="sizes"
            id="sizes"
            value={sizesInput}
            onChange={handleSizesInputChange}
            className={inputClass}
            placeholder={"Ej: 50 (para 50g), 1 (para 1 unidad), o dejar vacío"}
          />
          {formErrors.sizes && <p className={errorClass}>{formErrors.sizes}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Para productos que no son fragancias: ingrese tamaños/pesos informativos (ej: 50 para 50g/ml, 1 para unidad) o deje vacío si no aplica. El precio se define manually.
          </p>
        </div>
      )}

      {/* Control de Visibilidad */}
      <div className="flex items-center space-x-3 py-2 border-t border-b border-gray-200">
        <input
          type="checkbox"
          name="isVisible"
          id="isVisible"
          checked={formData.isVisible}
          onChange={handleChange}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">
          Visible en la tienda
        </label>
        <p className="text-xs text-gray-500">
          (Desmarcar para ocultar el producto de la vista del cliente)
        </p>
      </div>


      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-70"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-colors disabled:opacity-70 flex items-center justify-center min-w-[120px]"
        >
          {isLoading ?
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> :
            (formData.id ? 'Guardar Cambios' : 'Crear Producto')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;