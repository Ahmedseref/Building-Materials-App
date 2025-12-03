import React from 'react';
import { Package, FileText, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  activeTab: 'market' | 'pi';
  setActiveTab: (tab: 'market' | 'pi') => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, cartCount }) => {
  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('market')}>
            <div className="bg-orange-500 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">BuildMat<span className="text-orange-400">Pro</span></span>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('market')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'market' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('pi')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'pi' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Proforma Invoice
              {cartCount > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;