import React, { useEffect, useState } from "react";import api from '@/utils/api';
import { Trash2, Plus, Minus } from "lucide-react";

const API_URL = " /api/cart"; // backend cart route

const Cart = ({ userId: propUserId }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get userId from localStorage if not passed as prop
  const userId = propUserId || localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Axios config with token
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch cart
  const fetchCart = async () => {
    try {
      const res = await api.get(`${API_URL}/getAllCart/${userId}`, config);
      setCart(res.data);
    } catch (error) {
      
      console.error("Error fetching cart:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // prevent 0 quantity

    try {
      const res = await api.put(
        `${API_URL}/updateCartItem`,
        { userId, productId, quantity: newQuantity },
        config
      );
      setCart(res.data.cart);
    } catch (error) {
      console.error("Error updating cart:", error.response?.data || error.message);
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`${API_URL}/removeCart`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId, productId },
      });
      setCart(res.data.cart);
    } catch (error) {
      console.error("Error removing item:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  if (loading) return <p className="text-center">Loading cart...</p>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return <p className="text-center text-gray-500">Your cart is empty</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <ul className="space-y-4">
        {cart.items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center justify-between border-b pb-3"
          >
            <div className="flex items-center space-x-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="p-1 border rounded hover:bg-gray-100"
              >
                <Minus size={16} />
              </button>
              <span className="font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="p-1 border rounded hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>

            <p className="font-semibold">₹{item.totalPrice}</p>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold">
          Total: ₹{cart.totalAmount}
        </h3>
      </div>
    </div>
  );
};

export default Cart;
