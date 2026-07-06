const express = require("express");
const router = express.Router();
const path = require("path");

// Import controller functions
const {
  createDeliveryPerson,
  getAllDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPerson,
  getDeliveryPersonActive,
  deleteDeliveryPerson,
  approveDeliveryPerson,
  updateAvailability,
  assignDeliveryPerson,
  updateDeliveryPersonStatus,
  updateDeliveryPersonStatusBySelf,
} = require("../controllers/deliveryPersonController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const uploadDeliveryPerson = require("../middleware/uploadDeliveryPerson.js");

// 📌 CRUD Routes
router.post(
  "/createDeliveryPerson",
  uploadDeliveryPerson.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "licenseFile", maxCount: 1 },
    { name: "idProofFile", maxCount: 1 },
  ]),
  authenticateUser,
  authorizeRoles("user", "admin"),
  createDeliveryPerson
);

router.get(
  "/getAllDeliveryPersons",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getAllDeliveryPersons
);
router.get(
  "/getDeliveryPersonById/:id",
  authenticateUser,
  authorizeRoles("delivery_person", "user", "admin"),
  getDeliveryPersonById
);
router.get(
  "/getDeliveryPersonActive",
  authenticateUser,
  authorizeRoles("admin"),
  getDeliveryPersonActive
);

router.put(
  "/updateDeliveryPerson/:id",
  uploadDeliveryPerson.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "licenseFile", maxCount: 1 },
    { name: "idProofFile", maxCount: 1 },
  ]),
  authenticateUser,
  authorizeRoles("delivery_person", "user", "admin"),
  updateDeliveryPerson
);

router.delete(
  "/deleteDeliveryPerson/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  deleteDeliveryPerson
); // admin

router.put(
  "/deliveryPerson/status/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  updateDeliveryPersonStatus
);
router.put(
  "/updateDeliveryPersonStatusBySelf/:id",
  authenticateUser,
  authorizeRoles("delivery_person", "admin"),
  updateDeliveryPersonStatusBySelf
);

// 📌 Extra Routes
router.put(
  "/approveDeliveryPerson/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  approveDeliveryPerson
); //admin
router.put(
  "/updateAvailability/:id",
  authenticateUser,
  authorizeRoles("delivery_person", "admin"),
  updateAvailability
);
// Only admin can assign delivery persons
router.put(
  "/assignDeliveryPerson",
  authenticateUser,
  authorizeRoles("admin"),
  assignDeliveryPerson
);

module.exports = router;
