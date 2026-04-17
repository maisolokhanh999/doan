import { useState, useEffect, useRef } from 'react';
import ProductCost from '../Components/ProductCost.jsx';
import './Product.css';
const Product = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const productRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (productRef.current) {
        const yOffset = -100; // chỉnh khoảng cách
        const y =
          productRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCategory]);
 

  const categories = [
  ...new Set((products || []).map(p => p.category))
];

  const selectProduct = (product) => {
    setSelectedProduct(product);
  };

  if (selectedProduct) {
    return (
      <div>
        <ProductCost product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      </div>
    );
  }

  const safeProducts = products || [];
  const filteredProducts = safeProducts.filter(item => {
    const matchesCategory = selectedCategory
      ? (typeof selectedCategory === "string"
          ? item.category === selectedCategory
          : item.category === selectedCategory.slug)
      : true;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return (
    <div className="product-container">
      <div className="max-w-7xl mx-auto p-6">

        {/* 🔥 TITLE */}
        <h1 className="text-5xl font-serif font-bold mb-12 text-primary tracking-widest text-center uppercase drop-shadow-sm">BỘ SƯU TẬP MUA SẮM</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${!selectedCategory ? 'bg-primary text-white shadow-lg' : 'bg-surface-variant text-primary hover:bg-primary-light'}`}
            >
              TẤT CẢ
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                    ? "bg-primary text-white shadow-lg"
                    : "bg-surface-variant text-primary hover:bg-primary-light"
                  }`}
              >
                {category[0]?.toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex items-center bg-surface-variant px-4 py-2 rounded-full border border-outline-variant w-full md:w-64">
            <span className="material-symbols-outlined text-primary-light">search</span>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="bg-transparent outline-none flex-1 text-primary placeholder:text-primary-light px-2"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 🔥 GRID */}
        <div ref={productRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">

          {filteredProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => selectProduct(item)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer group overflow-hidden"
            >
              {/* 🔥 IMAGE */}
              <div className="relative overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition duration-300"
                />

                {/* 🔥 BADGE */}
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  -{item.discountPercentage}%
                </span>
              </div>

              {/* 🔥 CONTENT */}
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                  {item.title}
                </h3>

                {/* PRICE */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary font-bold text-xl">
                    ${item.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${Math.round(item.price * 1.2)}
                  </span>
                </div>

                {/* RATING + STOCK */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="text-yellow-500">⭐ {item.rating}</span>
                  <span>Còn {item.stock}</span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Product;
