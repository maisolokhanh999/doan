import { useState } from 'react';
import { useCart } from './CartContext.jsx';

const ProductCost = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, parseInt(quantity, 10) || 1);
    alert(`Added ${quantity} ${product.title} to the cart!`);
  };

  return (
    <div className="min-h-screen  py-12">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={onBack}
          className="mb-12 inline-flex items-center px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 font-semibold"
        >
          ← Back
        </button>
        
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-1/2 lg:p-12 p-8 flex flex-col items-center">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full max-w-md h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="lg:w-1/2 lg:p-12 p-8">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">{product.title}</h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>
              
              <div className="mb-10">
                <div className="space-y-4 mb-8">
                  <p className="text-5xl font-bold text-red-500">${product.price}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl text-yellow-400">⭐ {product.rating}</span>
                    <span className="text-xl text-gray-700 font-semibold">
                      Còn {product.stock} sản phẩm
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xl font-semibold mb-3">quantity:</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(0, quantity - 1))}
                      className="w-14 h-14 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors font-bold text-lg"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(0, Math.min(product.stock, parseInt(e.target.value) || 0)))}
                      className="w-24 text-center p-3 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      min="0"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-14 h-14 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors font-bold text-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-5 px-8 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
              >
                🛒 Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCost;
