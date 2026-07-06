import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "/api/cart";

/* =========================================
   🔹 HELPER: Set Cart State
========================================= */
const setCartState = (state, cart) => {
  if (!cart) {
    state.cartItems = [];
    state.totalItems = 0;
    state.totalPrice = 0;
    state.deliveryCharges = 0;
    return;
  }

  state.cartItems = cart.items || [];
  state.totalPrice = cart.payableAmount || 0;
  state.deliveryCharges = cart.deliveryCharges || 0;
  state.coinsUsed = cart.coinsUsed || 0;
  state.totalItems =
    cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
};

/* =========================================
   🔹 FETCH CART
========================================= */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/getMyCart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data?.cart || null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

/* =========================================
   🔹 ADD TO CART
========================================= */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId }, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(
        `${API}/addToCart`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Always fetch fresh cart after add
      dispatch(fetchCart());
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item",
      );
    }
  },
);

/* =========================================
   🔹 DECREASE QUANTITY
========================================= */
export const decreaseCartItem = createAsyncThunk(
  "cart/decreaseCartItem",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(
        `${API}/removeCartItem`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Always fetch fresh cart after decrease
      dispatch(fetchCart());
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to decrease quantity",
      );
    }
  },
);

/* =========================================
   🔹 INITIAL STATE
========================================= */
const initialState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  deliveryCharges: 0,
  coinsUsed: 0,
  loading: false,
  error: null,
};

/* =========================================
   🔹 SLICE
========================================= */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.deliveryCharges = 0;
      state.coinsUsed = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ================= FETCH ================= */
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        setCartState(state, action.payload);
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        setCartState(state, null);
      })

      /* ================= ADD ================= */
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DECREASE ================= */
      .addCase(decreaseCartItem.pending, (state) => {
        state.loading = true;
      })

      .addCase(decreaseCartItem.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(decreaseCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
