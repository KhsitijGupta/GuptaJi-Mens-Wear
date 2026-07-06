const ContactUs = require("../models/ContactUs.js");

// POST: Submit contact form
const submitContactForm = async (req, res) => {
  const { fullName, email , message } = req.body;

  try {
    const newMessage = new ContactUs({ fullName, email, message});
    await newMessage.save();
    res.status(200).json({ success: true, message: "Message submitted successfully!" });
  } catch (error) {
    console.error("POST Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET: Fetch all contact messages
const getAllContactUs = async (req, res) => {
  try {
    const messages = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("GET Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const deleteContactMessage = async (req, res) => {
  const { id } = req.params;  
  try {
    const deletedMessage = await ContactUs.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
module.exports = {
  submitContactForm,
  getAllContactUs,
  deleteContactMessage,
};
