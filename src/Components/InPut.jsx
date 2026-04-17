import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
const SearchBar = ({ products }) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
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
    navigate(`/product/${product.id}`); // 🔥 chỉ gửi ra ngoài
  };
  return (
    <div className="relative w-full mb-6">
      {/* input */}
      <input
        type="text"
        placeholder="🔍 Tìm kiếm sản phẩm..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full p-4 text-lg border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none bg-surface"
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