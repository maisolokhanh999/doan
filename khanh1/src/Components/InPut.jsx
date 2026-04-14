import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!query) return;

    fetch(`https://dummyjson.com/products/search?q=${query}`)
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .catch(err => console.log(err));
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Kết quả cho: "{query}"
      </h1>

      <div className="grid grid-cols-4 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-lg"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-40 w-full object-cover rounded"
            />
            <h2 className="mt-2 font-bold">{product.title}</h2>
            <p className="text-red-500">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;