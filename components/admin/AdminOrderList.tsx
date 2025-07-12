
import React from 'react';
import jsPDF from 'jspdf';
import { Order, OrderStatus } from '../../types';
import { ORDER_STATUS_OPTIONS } from '../../constants';
import TrashIcon from '../icons/TrashIcon';
import PrinterIcon from '../icons/PrinterIcon';

interface AdminOrderListProps {
    orders: Order[];
    onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    onDeleteOrder: (order: Order) => void;
    disabled?: boolean;
}

const AdminOrderList: React.FC<AdminOrderListProps> = ({ orders, onUpdateStatus, onDeleteOrder, disabled = false }) => {
    if (orders.length === 0) {
        return <p className="text-center text-gray-500 py-10">No hay pedidos para mostrar.</p>;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColorClass = (status: OrderStatus) => {
        switch (status) {
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Confirmado': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Enviado': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
            case 'Entregado': return 'bg-green-100 text-green-800 border-green-300';
            case 'Cancelado': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    }

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        onUpdateStatus(orderId, status);
    };

    const handlePrintOrder = (order: Order) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;
        const centerText = (text: string, y: number) => {
            const textWidth = doc.getTextWidth(text);
            const textX = (pageWidth - textWidth) / 2;
            doc.text(text, textX, y);
        };

        // Título
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        centerText(`MILLANEL RESISTENCIA - Pedido N°: ${order.orderNumber || 'N/A'}`, 20);

        // Info General
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha: ${formatDate(order.orderDate)}`, margin, 30);
        doc.text(`Estado: ${order.status}`, margin, 36);

        doc.line(margin, 40, pageWidth - margin, 40);

        // Datos del Cliente
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Datos del Cliente', margin, 48);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nombre: ${order.customerInfo.name}`, margin, 56);
        doc.text(`Dirección: ${order.customerInfo.address}`, margin, 62);
        doc.text(`Teléfono: ${order.customerInfo.phone}`, margin, 68);
        if (order.customerInfo.notes) {
            const notesLines = doc.splitTextToSize(`Notas: ${order.customerInfo.notes}`, pageWidth - margin * 2);
            doc.text(notesLines, margin, 74);
        }

        let yPosition = 85;
        if (order.customerInfo.notes) {
            yPosition = 74 + (doc.getTextDimensions(doc.splitTextToSize(`Notas: ${order.customerInfo.notes}`, pageWidth - margin * 2)).h) + 5;
        }
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        // Detalle del Pedido - Formato Tabla
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalle del Pedido', margin, yPosition);
        yPosition += 8;

        // Encabezados de la tabla
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const colDesc = margin;
        const colSubtotal = pageWidth - margin;
        const colUnitPrice = colSubtotal - 30;
        const colQty = colUnitPrice - 20;

        doc.text('Descripción', colDesc, yPosition);
        doc.text('Cant.', colQty, yPosition, { align: 'right' });
        doc.text('P. Unit.', colUnitPrice, yPosition, { align: 'right' });
        doc.text('Subtotal', colSubtotal, yPosition, { align: 'right' });
        yPosition += 3;
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;

        // Items de la tabla
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        order.items.forEach(item => {
            const description = `${item.name} (${item.selectedSize > 0 ? `${item.selectedSize}ml` : 'unidad'})`;
            const quantity = item.quantity.toString();
            const unitPrice = `${item.price.toFixed(2)}`;
            const subtotal = `${(item.price * item.quantity).toFixed(2)}`;

            const descLines = doc.splitTextToSize(description, colQty - colDesc - 2);
            const itemHeight = descLines.length * 5;

            doc.text(descLines, colDesc, yPosition);
            doc.text(quantity, colQty, yPosition, { align: 'right' });
            doc.text(unitPrice, colUnitPrice, yPosition, { align: 'right' });
            doc.text(subtotal, colSubtotal, yPosition, { align: 'right' });

            yPosition += itemHeight + 2; // Espacio extra entre items
        });

        yPosition += 3;
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        // Total
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        const totalText = `Total: ${order.totalAmount.toFixed(2)}`;
        doc.text(totalText, pageWidth - margin, yPosition, { align: 'right' });

        doc.save(`pedido-${order.orderNumber || order.id}.pdf`);
    };

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Pedido</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Cliente</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                {order.orderNumber || 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.orderDate)}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.customerInfo.name}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 max-w-md truncate" title={order.customerInfo.address}>{order.customerInfo.address}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerInfo.phone}</td>
                            <td className="px-4 py-4 whitespace-normal text-xs text-gray-600 max-w-xs">
                                {order.items.map(item => (
                                    <div key={`${item.name}-${item.selectedSize}`} className="truncate">
                                        {item.name} ({item.selectedSize > 0 ? `${item.selectedSize}ml` : 'unidad'}) x{item.quantity}
                                    </div>
                                ))}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    disabled={disabled}
                                    className={`text-xs font-medium p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed ${getStatusColorClass(order.status)}`}
                                    aria-label={`Estado del pedido ${order.id}`}
                                >
                                    {ORDER_STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-1 py-4 text-center">
                                <div className="flex justify-center items-center space-x-1">
                                    <button
                                        onClick={() => handlePrintOrder(order)}
                                        disabled={disabled}
                                        className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label={`Imprimir pedido ${order.id}`}
                                        title="Imprimir Pedido"
                                    >
                                        <PrinterIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteOrder(order)}
                                        disabled={disabled}
                                        className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label={`Eliminar pedido ${order.id}`}
                                        title="Eliminar Pedido"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrderList;
