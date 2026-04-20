
import React from 'react';
import WhatsAppIcon from './icons/WhatsAppIcon'; // Asumiendo que tienes este icono

interface WelcomeModalProps {
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto transform transition-all animate-fadeIn">
                <h3 className="text-2xl font-bold text-primary mb-4 text-center">
                    ¡Bienvenido/a a Millanel Resistencia!
                </h3>
                <div className="text-gray-700 space-y-3 mb-6">
                    <p>¡Gracias por visitarnos! Aquí te explicamos cómo navegar y comprar:</p>
                    <ol className="list-decimal list-inside space-y-2 pl-2">
                        <li>
                            <strong>Explora</strong>: Usa la barra de búsqueda y los filtros (género, autor) para encontrar tus productos favoritos.
                        </li>
                        <li>
                            <strong>Añade al Carrito</strong>: ¿Viste algo que te gusta? Elige el tamaño (si es una fragancia) y haz clic en 'Añadir', o en 'Pedir' si quieres ir directamente al carrito con ese producto.
                        </li>
                        <li>
                            <strong>Revisa tu Pedido</strong>: Haz clic en el ícono del carrito (arriba a la derecha) para ver los productos seleccionados y ajustar cantidades.
                        </li>
                        <li>
                            <strong>Completa tu Compra</strong>: Ingresa tus datos de contacto y dirección, y luego haz clic en 'Realizar Pedido'. Nos pondremos en contacto contigo para confirmar y coordinar la entrega.
                        </li>
                    </ol>
                    <div className="flex items-center justify-center text-sm text-gray-600 pt-2">
                        <WhatsAppIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span>¿Consultas? ¡Escríbenos por WhatsApp! (ícono en el pie de página).</span>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-primary hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        ¡Entendido!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
