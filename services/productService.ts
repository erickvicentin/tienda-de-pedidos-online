
import { db } from '../firebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { Product, ProductCategory, Gender } from '../types';

const productsCollectionRef = collection(db, 'products');

// Helper para convertir Firestore doc a Product
const mapDocToProduct = (docSnap: QueryDocumentSnapshot<DocumentData>): Product => {
    const data = docSnap.data();
    return {
        id: docSnap.id,
        name: data.name || '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        category: (data.category as ProductCategory) || 'Otra',
        gender: (data.gender as Gender) || 'Unisex',
        author: data.author || '',
        sizes: Array.isArray(data.sizes) ? data.sizes.filter(s => typeof s === 'number') : [],
    };
};


export const getProducts = async (): Promise<Product[]> => {
  try {
    const data = await getDocs(productsCollectionRef);
    return data.docs.map(mapDocToProduct);
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    throw new Error("No se pudieron cargar los productos desde la base de datos.");
  }
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const docRef = await addDoc(productsCollectionRef, productData);
    // Firestore devuelve un DocumentReference. Para obtener el producto completo con ID:
    return { ...productData, id: docRef.id } as Product;
  } catch (error) {
    console.error("Error adding product to Firestore:", error);
    throw new Error("Error al añadir el producto a la base de datos.");
  }
};

export const updateProduct = async (productId: string, productData: Partial<Omit<Product, 'id'>>): Promise<void> => {
  try {
    const productDoc = doc(db, 'products', productId);
    await updateDoc(productDoc, productData);
  } catch (error) {
    console.error("Error updating product in Firestore:", error);
    throw new Error("Error al actualizar el producto en la base de datos.");
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productDoc = doc(db, 'products', productId);
    await deleteDoc(productDoc);
  } catch (error) {
    console.error("Error deleting product from Firestore:", error);
    throw new Error("Error al eliminar el producto de la base de datos.");
  }
};
