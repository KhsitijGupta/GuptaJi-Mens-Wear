import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "/api/addresses";

/* =========================================
   🔹 GET ADDRESSES BY USER ID
========================================= */
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async ({ rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/getAddressUserId`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data.addresses;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses",
      );
    }
  },
);

/* =========================================
   🔹 CREATE ADDRESS
========================================= */
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      console.log(addressData);
      const res = await axios.post(
        `/api/addresses/createAddress`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      return res.data.address;
    } catch (error) {
      console.log(error.response.data.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create address",
      );
    }
  },
);

/* =========================================
   🔹 UPDATE ADDRESS
========================================= */
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data.updatedAddress;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update address",
      );
    }
  },
);

/* =========================================
   🔹 DELETE ADDRESS
========================================= */
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/deleteAddressId/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete address",
      );
    }
  },
);

/* =========================================
   🔹 SLICE
========================================= */
const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAddressState: (state) => {
      state.addresses = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload || [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })

      /* UPDATE */
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (addr) => addr._id === action.payload._id,
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (addr) => addr._id !== action.payload,
        );
      });
  },
});

export const { clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;
