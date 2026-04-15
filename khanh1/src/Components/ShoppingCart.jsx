import { useCart } from "./CartContext.jsx";
import "./ShoppingCart.css";
import { message } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router";
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
   const navigate = useNavigate();
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  useEffect(() => {
    if (cart.length === 0) {
      message.warning("Giỏ hàng đang trống!");
      navigate("/");
    }
  }, [cart]);

  return (
    <div className="ShoppingCart-container font-sans">
      <h2 className="text-3xl font-serif font-bold mb-8 text-primary">🛒 Giỏ hàng của bạn</h2>

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
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="text-gray-500 font-sans">${item.price}</p>
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
            className="text-accent font-bold hover:scale-110 transition-transform"
          >
            ✕
          </button>
        </div>
      ))}

      {/* SUMMARY */}
      <div className="mt-5 border-t pt-4">
        <p className="text-lg">
          Tổng sản phẩm: <strong>{totalQuantity}</strong>
        </p>
        <p className="text-xl font-bold text-primary font-serif">
          Tổng tiền: ${totalPrice.toFixed(2)}
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={clearCart}
            className="flex-1 py-4 px-6 hover:brightness-110 text-white font-bold rounded-2xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            style={{ backgroundColor: '#D81B60' }}
          >
            🗑️ Xóa tất cả
          </button>

          <button 
            className="flex-2 py-4 px-10 hover:brightness-110 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-xl flex items-center justify-center gap-2"
            style={{ backgroundColor: '#7A5348', background: 'linear-gradient(to right, #7A5348, #77574D)' }}
            onClick={() => {
              const token = localStorage.getItem('token');
              const userString = localStorage.getItem('user');
              const user = userString ? JSON.parse(userString) : null;
              
              if (!token || !user) {
                message.warning("Vui lòng đăng nhập để thanh toán!");
                navigate('/Login');
              } else {
                message.loading({ content: 'Đang xử lý...', key: 'checkout' });
                const payload = {
                  id: Date.now(),
                  customer: user.name || user.user,
                  date: new Date().toISOString(),
                  items: cart,
                  totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                  status: 'pending'
                };

                fetch('http://localhost:5000/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                }).then(res => res.json())
                .then(() => {
                  message.success({ content: "Thanh toán thành công! Đơn hàng đã được lưu tới Admin.", key: 'checkout', duration: 2 });
                  clearCart();
                })
                .catch(err => {
                  console.error(err);
                  message.error({ content: "Lỗi kết nối tới máy chủ lưu đơn!", key: 'checkout', duration: 2 });
                });
              }
            }}
          >
            💳 Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;