import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";import api from '@/utils/api';

const API = "/api/orders";

/* =========================================
   🔹 CREATE ORDER
========================================= */
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ shippingAddress, paymentMethod }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${API}/createOrder`,
        { shippingAddress, paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return res.data; // return full API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Order creation failed",
      );
    }
  },
);

export const verifyRazorpayPayment = createAsyncThunk(
  "order/verifyRazorpayPayment",
  async (
    { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post(
        `${API}/verifyRazorpayPayment`,
        { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Razorpay verification failed",
      );
    }
  },
);

/* =========================================
   🔹 GET USER ORDERS
========================================= */
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API}/getUserOrder`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("sdjhfks", res.data);
      // 🔥 return only orders array
      return res.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

/* =========================================
   🔹 CANCEL ORDER
========================================= */
// export const cancelOrder = createAsyncThunk(
//   "order/cancelOrder",
//   async (orderId, { rejectWithValue }) => {
//     try {
//       await axios.delete(
//         `${API}/cancelOrder/${orderId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       return orderId;
//     } catch (error) {
//       // return rejectWithValue(error.response?.data?.message || "Cancel failed");

//   console.error("Cancel Order Error:", error.response?.data || error.message);
//   return rejectWithValue(error.response?.data?.message || "Cancel failed");

//     }
//   },
// );

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await api.delete(`${API}/cancelOrder/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return orderId;
    } catch (error) {
      console.error(
        "Cancel Order Error:",
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data?.message || "Cancel failed");
    }
  },
);
/* =========================================
   🔹 SLICE
========================================= */
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    /* 🔥 Clear only status flags */
    clearOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    /* 🔥 Full reset (used on logout) */
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= CREATE ORDER ================= */
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const payloadOrder = action.payload?.order || action.payload;
        state.currentOrder = payloadOrder;

        // optional: add new order to top
        if (payloadOrder) {
          state.orders.unshift(payloadOrder);
        }
      })
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const payloadOrder = action.payload?.order || action.payload;
        state.currentOrder = payloadOrder;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= GET USER ORDERS ================= */
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = []; // 🔥 reset if failed
      })

      /* ================= CANCEL ORDER ================= */
      // .addCase(cancelOrder.fulfilled, (state, action) => {
      //   state.orders = state.orders.map((order) =>
      //     order._id === action.payload
      //       ? { ...order, orderStatus: "Cancelled" }
      //       : order,
      //   );
      // });
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload
            ? { ...order, orderStatus: "Cancelled" }
            : order,
        );
      });
  },
});

export const { clearOrderState, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
