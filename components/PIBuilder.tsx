import React, { useState } from 'react';
import { 
  Trash2, Eye, EyeOff, FileDown, FileSpreadsheet, 
  Wand2, Calculator, Save 
} from 'lucide-react';
import { PIItem, CustomerDetails, PIVisibilitySettings } from '../types';
import ImageEditor from './ImageEditor';

interface PIBuilderProps {
  items: PIItem[];
  customer: CustomerDetails;
  onUpdateCustomer: (details: CustomerDetails) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onUpdateItemImage: (id: string, newImage: string) => void;
  onRemoveItem: (id: string) => void;
}

const PIBuilder: React.FC<PIBuilderProps> = ({
  items,
  customer,
  onUpdateCustomer,
  onUpdateQuantity,
  onUpdateItemImage,
  onRemoveItem
}) => {
  // Visibility State
  const [visibility, setVisibility] = useState<PIVisibilitySettings>({
    showManufacturer: true,
    showDescription: true,
    showImages: true,
    showUnit: true,
    showNotes: false
  });

  // Editor State
  const [editingItem, setEditingItem] = useState<PIItem | null>(null);

  // Calculate Totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.15; // Example 15% VAT
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Product', 'Category', 'Quantity', 'Unit', 'Unit Price', 'Total'];
    if (visibility.showManufacturer) headers.splice(2, 0, 'Manufacturer');
    
    const rows = items.map(item => {
      const row = [
        item.id,
        item.name,
        item.category,
        item.quantity,
        item.unit,
        item.price.toFixed(2),
        (item.price * item.quantity).toFixed(2)
      ];
      if (visibility.showManufacturer) row.splice(2, 0, item.manufacturer);
      return row.join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n" 
      + rows.join('\n')
      + `\n\n,,,,,Subtotal,${subtotal.toFixed(2)}`
      + `\n,,,,,Tax (15%),${tax.toFixed(2)}`
      + `\n,,,,,Total,${total.toFixed(2)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PI_${customer.piNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Editor Modal */}
      {editingItem && (
        <ImageEditor 
          isOpen={true}
          onClose={() => setEditingItem(null)}
          originalImageUrl={editingItem.editedImage || editingItem.image}
          productName={editingItem.name}
          onSave={(newImg) => {
            onUpdateItemImage(editingItem.id, newImg);
            setEditingItem(null);
          }}
        />
      )}

      {/* Toolbar - Hidden when printing */}
      <div className="bg-slate-100 p-4 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center no-print">
        <div className="flex items-center space-x-4">
           <span className="text-sm font-semibold text-slate-700">Display Options:</span>
           <div className="flex flex-wrap gap-2">
             <button 
               onClick={() => setVisibility(prev => ({...prev, showImages: !prev.showImages}))}
               className={`px-2 py-1 text-xs rounded border ${visibility.showImages ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-300 text-slate-600'}`}
             >
               Images
             </button>
             <button 
               onClick={() => setVisibility(prev => ({...prev, showManufacturer: !prev.showManufacturer}))}
               className={`px-2 py-1 text-xs rounded border ${visibility.showManufacturer ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-300 text-slate-600'}`}
             >
               Manufacturer
             </button>
             <button 
               onClick={() => setVisibility(prev => ({...prev, showDescription: !prev.showDescription}))}
               className={`px-2 py-1 text-xs rounded border ${visibility.showDescription ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-300 text-slate-600'}`}
             >
               Description
             </button>
           </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Excel
          </button>
          <button onClick={handlePrint} className="flex items-center px-3 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 text-sm">
            <FileDown className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-8 max-w-5xl mx-auto print:p-0 print:max-w-none">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between mb-12 print:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">PROFORMA INVOICE</h1>
            <p className="text-slate-500 font-medium">BuildMat Pro Solutions</p>
            <p className="text-sm text-slate-500 mt-1">
              Building 45, Industrial Zone<br />
              New York, NY 10001<br />
              contact@buildmatpro.com
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-right print:mt-0">
             <div className="space-y-1">
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <span className="text-slate-500">PI Number:</span>
                 <input 
                   type="text" 
                   value={customer.piNumber}
                   onChange={(e) => onUpdateCustomer({...customer, piNumber: e.target.value})}
                   className="text-right font-medium text-slate-900 border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-orange-500 bg-transparent"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <span className="text-slate-500">Date:</span>
                 <input 
                   type="date" 
                   value={customer.date}
                   onChange={(e) => onUpdateCustomer({...customer, date: e.target.value})}
                   className="text-right font-medium text-slate-900 border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-orange-500 bg-transparent"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <span className="text-slate-500">Valid Until:</span>
                 <input 
                   type="date" 
                   value={customer.validUntil}
                   onChange={(e) => onUpdateCustomer({...customer, validUntil: e.target.value})}
                   className="text-right font-medium text-slate-900 border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-orange-500 bg-transparent"
                 />
               </div>
             </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className="mb-10 p-6 bg-slate-50 rounded-lg print:bg-transparent print:p-0 print:mb-8 border border-slate-100 print:border-none">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Bill To</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="space-y-3">
              <input 
                placeholder="Customer Name"
                value={customer.name}
                onChange={(e) => onUpdateCustomer({...customer, name: e.target.value})}
                className="block w-full text-lg font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-orange-500 focus:outline-none placeholder-slate-300"
              />
              <input 
                placeholder="Company Name"
                value={customer.company}
                onChange={(e) => onUpdateCustomer({...customer, company: e.target.value})}
                className="block w-full text-sm text-slate-700 bg-transparent border-b border-dashed border-slate-300 focus:border-orange-500 focus:outline-none placeholder-slate-300"
              />
            </div>
            <div className="space-y-2">
              <input 
                placeholder="Email Address"
                value={customer.email}
                onChange={(e) => onUpdateCustomer({...customer, email: e.target.value})}
                className="block w-full text-sm text-slate-600 bg-transparent border-b border-dashed border-slate-300 focus:border-orange-500 focus:outline-none placeholder-slate-300"
              />
              <input 
                placeholder="Phone Number"
                value={customer.phone}
                onChange={(e) => onUpdateCustomer({...customer, phone: e.target.value})}
                className="block w-full text-sm text-slate-600 bg-transparent border-b border-dashed border-slate-300 focus:border-orange-500 focus:outline-none placeholder-slate-300"
              />
              <textarea 
                placeholder="Billing Address"
                value={customer.address}
                onChange={(e) => onUpdateCustomer({...customer, address: e.target.value})}
                rows={2}
                className="block w-full text-sm text-slate-600 bg-transparent border-b border-dashed border-slate-300 focus:border-orange-500 focus:outline-none placeholder-slate-300 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-3 text-sm font-bold text-slate-900 w-12">#</th>
                {visibility.showImages && <th className="py-3 text-sm font-bold text-slate-900 w-24">Image</th>}
                <th className="py-3 text-sm font-bold text-slate-900">Product</th>
                <th className="py-3 text-sm font-bold text-slate-900 text-center w-24">Qty</th>
                <th className="py-3 text-sm font-bold text-slate-900 text-right w-32">Price</th>
                <th className="py-3 text-sm font-bold text-slate-900 text-right w-32">Total</th>
                <th className="py-3 w-10 no-print"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, index) => (
                <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm text-slate-500 align-top pt-6">{index + 1}</td>
                  
                  {visibility.showImages && (
                    <td className="py-4 align-top">
                      <div className="relative w-16 h-16 rounded border border-slate-200 overflow-hidden bg-white group-hover:border-orange-300 transition-colors cursor-pointer" onClick={() => setEditingItem(item)} title="Click to Edit with AI">
                        <img src={item.editedImage || item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
                          <Wand2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                        </div>
                      </div>
                    </td>
                  )}
                  
                  <td className="py-4 align-top pt-5">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    {visibility.showManufacturer && (
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{item.manufacturer}</p>
                    )}
                    {visibility.showDescription && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 max-w-md">{item.description}</p>
                    )}
                  </td>
                  
                  <td className="py-4 align-top pt-5">
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-full text-center p-1 border rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    {visibility.showUnit && <p className="text-xs text-center text-slate-400 mt-1">{item.unit}</p>}
                  </td>
                  
                  <td className="py-4 text-right text-sm text-slate-700 align-top pt-6">
                    ${item.price.toFixed(2)}
                  </td>
                  
                  <td className="py-4 text-right text-sm font-bold text-slate-900 align-top pt-6">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  
                  <td className="py-4 text-right align-top pt-5 no-print">
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No items in invoice. Go to Marketplace to add products.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-slate-800">
              <tr>
                <td colSpan={visibility.showImages ? 4 : 3} className="pt-6 text-right text-sm font-medium text-slate-500">Subtotal</td>
                <td colSpan={2} className="pt-6 text-right text-sm font-bold text-slate-900">${subtotal.toFixed(2)}</td>
                <td className="no-print"></td>
              </tr>
              <tr>
                <td colSpan={visibility.showImages ? 4 : 3} className="pt-2 text-right text-sm font-medium text-slate-500">Tax (15%)</td>
                <td colSpan={2} className="pt-2 text-right text-sm font-bold text-slate-900">${tax.toFixed(2)}</td>
                <td className="no-print"></td>
              </tr>
              <tr>
                <td colSpan={visibility.showImages ? 4 : 3} className="pt-4 text-right text-lg font-bold text-slate-900">Total Due</td>
                <td colSpan={2} className="pt-4 text-right text-lg font-bold text-orange-600">${total.toFixed(2)}</td>
                <td className="no-print"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-sm text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
           <div>
             <h4 className="font-bold text-slate-900 mb-2">Terms & Conditions</h4>
             <ul className="list-disc list-inside space-y-1 text-xs">
               <li>Valid for 30 days from date of issue.</li>
               <li>50% deposit required to confirm order.</li>
               <li>Goods remain property of BuildMat Pro until paid in full.</li>
             </ul>
           </div>
           <div>
             <h4 className="font-bold text-slate-900 mb-2">Payment Details</h4>
             <div className="text-xs space-y-1">
               <p>Bank: Construction Bank Intl.</p>
               <p>Account Name: BuildMat Pro Solutions</p>
               <p>Account No: 8877 6655 4433</p>
               <p>Swift Code: CBINUS33</p>
             </div>
           </div>
        </div>
        
      </div>
    </div>
  );
};

export default PIBuilder;