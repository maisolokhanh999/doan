import { useState, useEffect, useRef } from 'react';
import ProductCost from '../Components/productcost';
import './Product.css';
const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.log(err));
  }, []);

  const categories = [
    ...new Set(products.map(p => p.category))
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

  const filteredProducts = selectedCategory
    ? products.filter(item =>
      typeof selectedCategory === "string"
        ? item.category === selectedCategory
        : item.category === selectedCategory.slug
    )
    : products;
  return (
    <div className="product-container">
      <div className="max-w-7xl mx-auto p-6">

        {/* 🔥 TITLE */}
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          🛍️ band list
        </h1>

        {/* 🔥 CATEGORY */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 ">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${!selectedCategory
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border hover:bg-gray-100"
              }`}
          >
            ALL
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border hover:bg-gray-100"
                }`}
            >
              {category[0]?.toUpperCase() + category.slice(1)}
            </button>
          ))}
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
                  <span className="text-red-500 font-bold text-xl">
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
