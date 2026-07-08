const DeliveryPerson = require("../models/DeliveryPerson");
const Order = require("../models/Order"); // assuming you have an Order model
const { uploadFile } = require("../services/cloudinaryService");

// Utility: Generate next deliveryBoyId like mmdb-0001
const generateDeliveryBoyId = async () => {
  const lastPerson = await DeliveryPerson.findOne().sort({ createdAt: -1 });
  if (!lastPerson || !lastPerson.deliveryBoyId) {
    return "ZKDB-0001";
  }
  const lastIdNum = parseInt(lastPerson.deliveryBoyId.split("-")[1]) || 0;
  const newIdNum = lastIdNum + 1;
  return `ZKDB-${String(newIdNum).padStart(4, "0")}`;
};

// ✅ Create new Delivery Person
module.exports.createDeliveryPerson = async (req, res) => {
  try {
    const deliveryBoyId = await generateDeliveryBoyId();

    const newData = {
      ...req.body,
      deliveryBoyId,
      role: "delivery_person", // 🔥 role set here
      profileImage: req.files?.profileImage
        ? (
            await uploadFile(
              req.files.profileImage[0],
              "deliveryPerson/profileImage",
            )
          ).secure_url
        : null,
      availabilityStatus: req.body.availabilityStatus || "Available",
      vehicleDetails: {
        vehicleType: req.body.vehicleType,
        vehicleNumber: req.body.vehicleNumber,
        licenseNumber: req.body.licenseNumber,
        licenseFile: req.files?.licenseFile
          ? (
              await uploadFile(
                req.files.licenseFile[0],
                "deliveryPerson/licenseFile",
              )
            ).secure_url
          : null,
      },
      idProof: {
        idType: req.body.idType,
        idNumber: req.body.idNumber,
        idFile: req.files?.idFile
          ? (await uploadFile(req.files.idFile[0], "deliveryPerson/idFile"))
              .secure_url
          : null,
      },
      address: {
        permanent: req.body.permanentAddress,
        current: req.body.currentAddress,
      },
      emergencyContact: {
        name: req.body.emergencyName,
        relation: req.body.emergencyRelation,
        phone: req.body.emergencyPhone,
      },
      assignedAreas: req.body.assignedAreas
        ? req.body.assignedAreas.split(",").map((a) => a.trim())
        : [],
    };

    const deliveryPerson = new DeliveryPerson(newData);
    await deliveryPerson.save();

    res.status(201).json({ success: true, data: deliveryPerson });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all Delivery Persons
module.exports.getAllDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: deliveryPersons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single Delivery Person
module.exports.getDeliveryPersonById = async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findById(req.params.id).sort({
      createdAt: -1,
    });
    if (!deliveryPerson) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery person not found" });
    }
    res.status(200).json({ success: true, data: deliveryPerson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ACTIVE DELIVERY PERSONS
module.exports.getDeliveryPersonActive = async (req, res) => {
  try {
    const activeDeliveryPersons = await DeliveryPerson.find({
      adminApproved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, activeDeliveryPersons });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching active delivery persons",
      error: error.message,
    });
  }
};

// ✅ Update Delivery Person
module.exports.updateDeliveryPerson = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files?.profileImage) {
      const uploaded = await uploadFile(
        req.files.profileImage[0],
        "deliveryPerson/profileImage",
      );
      updateData.profileImage = uploaded.secure_url;
    }
    if (req.files?.licenseFile) {
      const uploaded = await uploadFile(
        req.files.licenseFile[0],
        "deliveryPerson/licenseFile",
      );
      updateData["vehicleDetails.licenseFile"] = uploaded.secure_url;
    }
    if (req.files?.idFile) {
      const uploaded = await uploadFile(
        req.files.idFile[0],
        "deliveryPerson/idFile",
      );
      updateData["idProof.idFile"] = uploaded.secure_url;
    }

    if (req.body.assignedAreas) {
      updateData.assignedAreas = req.body.assignedAreas
        .split(",")
        .map((a) => a.trim());
    }

    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!deliveryPerson) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery person not found" });
    }

    res.status(200).json({ success: true, data: deliveryPerson });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete Delivery Person
module.exports.deleteDeliveryPerson = async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findByIdAndDelete(
      req.params.id,
    );
    if (!deliveryPerson) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery person not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Delivery person deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Approve or disapprove Delivery Person
module.exports.approveDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminApproved } = req.body;

    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      id,
      { adminApproved },
      { new: true, runValidators: true },
    );

    if (!deliveryPerson) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery person not found" });
    }

    res.status(200).json({
      success: true,
      message: `Delivery person ${adminApproved ? "approved" : "disapproved"}`,
      data: deliveryPerson,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Update Availability
module.exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availabilityStatus } = req.body;

    if (
      !["Available", "On Delivery", "Not Available"].includes(
        availabilityStatus,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability status",
      });
    }

    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      id,
      { availabilityStatus },
      { new: true, runValidators: true },
    );

    if (!deliveryPerson) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery person not found" });
    }

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: deliveryPerson,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Update Active / Inactive status
module.exports.updateDeliveryPersonStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminApproved } = req.body;

    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      id,
      { adminApproved },
      { new: true },
    );

    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Delivery person ${adminApproved ? "activated" : "deactivated"}`,
      data: deliveryPerson,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.updateDeliveryPersonStatusBySelf = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );

    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Delivery person ${isActive ? "activated" : "deactivated"}`,
      data: deliveryPerson,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.getDeliveryPersonActive = async (req, res) => {
  try {
    const activeDeliveryPersons = await DeliveryPerson.find({
      adminApproved: true,
    });

    res.status(200).json({ success: true, data: activeDeliveryPersons });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching active delivery persons",
    });
  }
};

// Assign a delivery person to an order

module.exports.assignDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId, orderId } = req.body;

    if (!deliveryPersonId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "deliveryPersonId and orderId are required",
      });
    }

    // ✅ Delivery person check
    const deliveryPerson = await DeliveryPerson.findOne({
      _id: deliveryPersonId,
      adminApproved: true,
    });

    if (!deliveryPerson) {
      return res.status(404).json({
        success: false,
        message: "Delivery person not available or not approved",
      });
    }

    // ✅ Order check
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.deliveryPerson) {
      return res.status(400).json({
        success: false,
        message: "Delivery person already assigned",
      });
    }

    // ✅ Assign order
    order.deliveryPerson = deliveryPersonId;
    order.orderStatus = "Out Of Delivery";
    await order.save();

    // ✅ Update delivery person
    deliveryPerson.assignedOrders.push({
      orderId: order._id,
    });

    deliveryPerson.availabilityStatus = "On Delivery";
    await deliveryPerson.save();

    res.status(200).json({
      success: true,
      message: `Delivery person ${deliveryPerson.fullName} assigned successfully`,
      data: order,
    });
  } catch (error) {
    console.error("Assign Delivery Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
