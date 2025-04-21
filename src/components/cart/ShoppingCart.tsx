import React, { useState } from 'react';
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { useMediaQuery } from '../../utils/hooks';

// Define the props for the Cart component
interface CartProps {
  isMobile: boolean;
}

const CartIconComponent: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex items-center justify-center">
      <ShoppingCartIcon
        size={isMobile ? 24 : 32}
        className="text-gray-600 cursor-pointer"
        onClick={onClick}
      />
    </div>
  );
};

export { CartIconComponent };

export default function ShoppingCart() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);

  function handleCartClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div
      className={`fixed z-[9999] ${
        isMobile ? 'bottom-4 right-4' : 'top-4 right-4'
      } transition-all duration-300`}
    >
      <div className="relative bg-white rounded-full shadow-md p-3">
        <CartIconComponent onClick={handleCartClick} />
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          0
        </span>
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-72 max-w-full max-h-[80vh] overflow-auto bg-white rounded-lg shadow-xl p-4">
          <h2 className="text-lg font-semibold mb-2">Shopping Cart</h2>
          <form className="mt-4">
            <label className="block mb-2">
              Service Type:
              <select className="ml-2 border rounded p-1">
                <option>Tax Filing</option>
                <option>Consultation</option>
                <option>Accounting Services</option>
              </select>
            </label>

            <label className="block mb-2">
              Quantity:
              <input type="number" className="ml-2 border rounded p-1" defaultValue={1} />
            </label>

            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
              Calculate
            </button>
          </form>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            onClick={handleCartClick}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
