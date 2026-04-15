import { useCart } from "./CartContext.jsx";

const ShoppingCart = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    clearCart,
    totalQuantity,
  } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-5 text-center">
        <h2 className="text-xl font-bold">🛒 Giỏ hàng trống</h2>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">🛒 Giỏ hàng</h2>

      {/* LIST PRODUCT */}
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border p-3 mb-3 rounded-lg shadow"
        >
          {/* INFO */}
          <div className="flex items-center gap-4">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-20 h-20 object-cover rounded"
            />

            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-500">${item.price}</p>
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => decreaseQuantity(item.id)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>

            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                setQuantity(item.id, parseInt(e.target.value) || 1)
              }
              className="w-16 text-center border rounded"
            />

            <button
              onClick={() => increaseQuantity(item.id)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          {/* PRICE */}
          <div className="w-24 text-right font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </div>

          {/* REMOVE */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 font-bold"
          >
            X
          </button>
        </div>
      ))}

      {/* SUMMARY */}
      <div className="mt-5 border-t pt-4">
        <p className="text-lg">
          Tổng sản phẩm: <strong>{totalQuantity}</strong>
        </p>
        <p className="text-xl font-bold">
          Tổng tiền: ${totalPrice.toFixed(2)}
        </p>

        <div className="mt-4 flex gap-3">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Xóa tất cả
          </button>

          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;