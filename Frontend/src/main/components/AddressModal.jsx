import React, { useEffect, useState, useRef } from "react";import api from '@/utils/api';
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { createAddress, fetchAddresses } from "../../redux/slices/addressSlice";

const AddressModal = ({ show, setShow, user, onAddressCreated }) => {
  const dispatch = useDispatch();
  const nameInputRef = useRef(null);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "India",
    pincode: "",
    landmark: "",
    city: "",
    state: "",
    addressType: "HOME",
  });

  useEffect(() => {
    if (show && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    if (show && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        phone: user.phone || "",
      }));
    }
  }, [show, user]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: "India" },
        );
        setStates(res.data.data.states || []);
      } catch (err) {
        console.error("State fetch error", err);
      }
    };
    fetchStates();
  }, []);

  const handleStateSelect = async (state) => {
    setFormData({ ...formData, state: state, city: "" });
    setStateSearch(state);
    setShowStateDropdown(false);

    try {
      const res = await api.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          country: "India",
          state: state,
        },
      );

      setCities(res.data.data || []);
    } catch (err) {
      console.error("City fetch error", err);
      setCities([]);
    }
  };

  const handleCitySelect = async (city) => {
    setFormData((prev) => ({ ...prev, city }));
    setCitySearch(city);
    setShowCityDropdown(false);

    try {
      const res = await api.get(
        `https://api.postalpincode.in/postoffice/${city}`,
      );

      if (res.data && res.data[0].Status === "Success") {
        const pincode = res.data[0].PostOffice[0].Pincode;

        setFormData((prev) => ({
          ...prev,
          city,
          pincode: pincode,
        }));
      }
    } catch (err) {
      console.error("Pincode fetch error", err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddAddress = async () => {
    try {
      const res = await dispatch(createAddress(formData)).unwrap();

      if (user?._id) dispatch(fetchAddresses(user._id));

      setShow(false);

      if (onAddressCreated) {
        onAddressCreated(res?.address?._id);
      }

      Swal.fire({
        icon: "success",
        title: "Address Saved!",
        timer: 1500,
        showConfirmButton: false,
      });

      setFormData({
        name: user.fullName || "",
        phone: user.phone || "",
        country: "India",
        pincode: "",
        landmark: "",
        city: "",
        state: "",
        addressType: "HOME",
      });

      setStateSearch("");
      setCitySearch("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save address",
      });
    }
  };

  if (!show) return null;

  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase()),
  );

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Add New Address</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              ref={nameInputRef}
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, phone: val.slice(0, 10) });
              }}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* STATE SEARCH DROPDOWN */}
          <div className="relative">
            <label className="text-sm font-medium">State</label>
            <input
              value={stateSearch}
              onChange={(e) => {
                setStateSearch(e.target.value);
                setShowStateDropdown(true);
              }}
              onFocus={() => setShowStateDropdown(true)}
              placeholder="Search state..."
              className="w-full border rounded-lg p-2 mt-1"
            />

            {showStateDropdown && (
              <div className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto rounded shadow z-10">
                {filteredStates.map((s) => (
                  <div
                    key={s.name}
                    onClick={() => handleStateSelect(s.name)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CITY SEARCH DROPDOWN */}
          <div className="relative">
            <label className="text-sm font-medium">City</label>
            <input
              value={citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setShowCityDropdown(true);
              }}
              onFocus={() => setShowCityDropdown(true)}
              placeholder="Search city..."
              className="w-full border rounded-lg p-2 mt-1"
            />

            {showCityDropdown && (
              <div className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto rounded shadow z-[999]">
                {filteredCities.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleCitySelect(c)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Pincode</label>
            <input
              name="pincode"
              value={formData.pincode}
              readOnly
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address Type</label>
            <select
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="HOME">HOME</option>
              <option value="WORK">WORK</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Full Address</label>
          <textarea
            name="landmark"
            rows="3"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShow(false)}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleAddAddress}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
