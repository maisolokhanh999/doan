const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

{cart.map(item => (
  <div key={item.id}>
    <p>{item.title}</p>

    <button onClick={() => decreaseQuantity(item.id)}>-</button>
    <span>{item.quantity}</span>
    <button onClick={() => increaseQuantity(item.id)}>+</button>

    <button onClick={() => removeFromCart(item.id)}>❌</button>
  </div>
))}