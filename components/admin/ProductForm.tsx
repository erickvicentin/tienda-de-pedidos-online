
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

// Define a specific type for the form's state
interface ProductFormState {
  id: string | undefined;
  name: string;
  description: string;
  imageUrl: string;
  category: ProductCategory;
  gender: Gender;
  author: string;
  sizes: number[];
}

// Define the initial state for a new product, conforming to ProductFormState
const newProductInitialState: ProductFormState = {
  id: undefined,
  name: '',
  description: '',
  imageUrl: '',
  category: 'Fragancia',
  gender: 'Unisex',
  author: '',
  sizes: [],
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, isLoading }) => {
  // Initialize formData state. If 'product' prop is provided, use its data; otherwise, use newProductInitialState.
  const [formData, setFormData] = useState<ProductFormState>(
    product ? { ...product, id: product.id } : newProductInitialState
  );
  
  const [sizesInput, setSizesInput] = useState(product?.sizes.join(', ') || '');
  const [formErrors, setFormErrors] = useState<Partial<Omit<ProductFormState, 'sizes' | 'id'>> & { sizes?: string }>({});

  // useEffect to update form state when 'product' prop changes
  useEffect(() => {
    if (product) {
      // Editing an existing product
      setFormData({
        ...product, // 'product' is type Product, so 'id' is string.
      });
      setSizesInput(product.sizes.join(', '));
    } else {
      // Adding a new product or clearing the form
      setFormData(newProductInitialState);
      setSizesInput('');
    }
    setFormErrors({}); // Reset errors when product context changes
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any })); // Use 'as any' for simplicity or create a more robust handler
    if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const handleSizesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizesInput(e.target.value);
     if (formErrors.sizes) {
        setFormErrors(prev => ({...prev, sizes: undefined}));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<Omit<ProductFormState, 'sizes' | 'id'>> & { sizes?: string } = {};
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

    const parsedSizes = sizesInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    if (parsedSizes.length === 0 && sizesInput.trim() !== '' && sizesInput.trim() !== '0') {
      errors.sizes = "Los tamaños deben ser números positivos separados por comas (ej: 30,60,100) o dejar vacío si no aplica. Si un tamaño es 0, ingrese solo '0'.";
    } else if (sizesInput.trim() === '') {
        // Es válido tener tamaños vacíos
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    const finalSizes = sizesInput.split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0);

    // Ensure productPayload matches Omit<Product, 'id'> or Product structure for onSave
    const productPayloadBase = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        category: formData.category,
        gender: formData.gender,
        author: formData.author,
        sizes: finalSizes,
    };
    
    if (formData.id) { // If formData.id exists (string), it's an update
      await onSave({ ...productPayloadBase, id: formData.id });
    } else { // If formData.id is undefined, it's a new product
      await onSave(productPayloadBase);
    }
  };
  
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const errorClass = "text-red-500 text-xs mt-1";

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
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Tamaños (ml, separados por coma)</label>
        <input 
          type="text" 
          name="sizes" 
          id="sizes" 
          value={sizesInput} 
          onChange={handleSizesChange} 
          className={inputClass}
          placeholder="Ej: 30,60,100 o 0 si aplica"
        />
        {formErrors.sizes && <p className={errorClass}>{formErrors.sizes}</p>}
        <p className="text-xs text-gray-500 mt-1">Dejar vacío si no tiene tamaños. Usar '0' para productos sin tamaño específico pero con precio único (ej. un accesorio).</p>
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
