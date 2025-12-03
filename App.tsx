import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import PIBuilder from './components/PIBuilder';
import { SAMPLE_PRODUCTS, INITIAL_CUSTOMER } from './constants';
import { Product, PIItem, CustomerDetails } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'pi'>('market');
  const [cart, setCart] = useState<PIItem[]>([]);
  const [customer, setCustomer] = useState<CustomerDetails>(INITIAL_CUSTOMER);

  // Toggle Add/Remove from PI
  const handleToggleCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const handleUpdateItemImage = (id: string, newImage: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, editedImage: newImage } : item));
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-900">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.length} 
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Marketplace View */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Building Materials Marketplace</h1>
                <p className="text-slate-500 mt-1">Select premium materials for your projects.</p>
              </div>
              <div className="flex gap-2">
                 <button 
                  onClick={() => setActiveTab('pi')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors"
                 >
                   Go to Invoice ({cart.length})
                 </button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAMPLE_PRODUCTS.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isInCart={cart.some(c => c.id === product.id)}
                  onToggleCart={handleToggleCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* PI View */}
        {activeTab === 'pi' && (
          <div className="space-y-6">
             <div className="flex items-center space-x-2 text-sm text-slate-500 mb-4 no-print">
               <button onClick={() => setActiveTab('market')} className="hover:text-orange-500 hover:underline">Marketplace</button>
               <span>/</span>
               <span className="font-semibold text-slate-900">Proforma Invoice</span>
             </div>

             <PIBuilder 
               items={cart}
               customer={customer}
               onUpdateCustomer={setCustomer}
               onUpdateQuantity={handleUpdateQuantity}
               onUpdateItemImage={handleUpdateItemImage}
               onRemoveItem={handleRemoveItem}
             />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} BuildMat Pro. Powered by Gemini Nano.
        </div>
      </footer>
    </div>
  );
};

export default App;