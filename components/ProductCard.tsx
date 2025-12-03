import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onToggleCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart, onToggleCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-700">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{product.name}</h3>
        </div>
        
        <p className="text-sm text-slate-500 mb-1">{product.manufacturer}</p>
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">{product.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {product.features.slice(0, 2).map((feat, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
              {feat}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div>
            <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
            <span className="text-sm text-slate-500"> / {product.unit}</span>
          </div>
          
          <button
            onClick={() => onToggleCart(product)}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
              isInCart 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-slate-900 text-white hover:bg-orange-500'
            }`}
          >
            {isInCart ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;