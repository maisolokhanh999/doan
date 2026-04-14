import { useState, useEffect } from 'react';
import ProductCost from './ProductCost.jsx';
const SearchBar = ({ products, onSelect }) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // debounce (tránh lag khi gõ)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!keyword.trim()) {
        setSuggestions([]);
        return;
      }

      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
      );

      setSuggestions(filtered.slice(0, 5)); // giới hạn 5 gợi ý
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, products]);

  const handleSelect = (product) => {
  setKeyword('');
  setSuggestions([]);
  onSelect(product); // 🔥 chỉ gửi ra ngoài
};
  return (
    <div className="relative w-full mb-6">
      {/* input */}
      <input
        type="text"
        placeholder="🔍 Find products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
      />

      {/* dropdown gợi ý */}
      {suggestions.length > 0 && (
        <div className="absolute w-full bg-white border mt-2 rounded-xl shadow-lg z-50">
          {suggestions.map(item => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-10 h-10 object-cover rounded"
              />
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;