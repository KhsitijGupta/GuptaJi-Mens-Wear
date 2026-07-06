const mongoose = require("mongoose");
const Address = require("../models/Address");
const User = require("../models/User");

// ✅ Create new address
exports.createAddress = async (req, res) => {
  try {
    const {
      phone,
      name,
      country,
      pincode,
      landmark,
      city,
      state,
      addressType,
    } = req.body;
    const userId = req.user.id;
    console.log(req.body);
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("user");

    const address = await Address.create({
      userId: new mongoose.Types.ObjectId(userId),
      name,
      phone,
      country,
      pincode,
      landmark,
      city,
      state,
      addressType,
    });

    // ✅ Push address into user's address array
    user.address.push(address._id);
    await user.save();

    const updatedUser = await User.findById(userId).populate("address");

    res.status(201).json({
      message: "Address created successfully",
      address,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Failed to create address", error: error.message });
  }
};

// ✅ Get all addresses for a user
exports.getAddressUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("address");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Addresses retrieved successfully",
      addresses: user.address,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to retrieve addresses", error: error.message });
  }
};

// ✅ Update address
exports.updateAddressId = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updatedAddress)
      return res.status(404).json({ message: "Address not found" });

    res
      .status(200)
      .json({ message: "Address updated successfully", updatedAddress });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update address", error: error.message });
  }
};

// ✅ Delete address
exports.deleteAddressId = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAddress = await Address.findByIdAndDelete(id);
    if (!deletedAddress)
      return res.status(404).json({ message: "Address not found" });

    // ✅ Remove address reference from user
    await User.findByIdAndUpdate(deletedAddress.userId, {
      $pull: { address: deletedAddress._id },
    });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to delete address", error: error.message });
  }
};
