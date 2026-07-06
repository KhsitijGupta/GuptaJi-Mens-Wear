const express = require("express");
const { submitContactForm, getAllContactUs, deleteContactMessage } = require("../controllers/contactUsController");
const router = express.Router();

router.post("/addContactMessage", submitContactForm);    
router.get("/getContactMessages", getAllContactUs);  
router.delete("/deleteContactMessage/:id", deleteContactMessage);  

module.exports = router;
