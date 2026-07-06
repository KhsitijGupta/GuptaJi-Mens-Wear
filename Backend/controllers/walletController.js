const Wallet = require("../models/Wallet");

// Helper function to calculate coins based on amount spent
const calculateCoins = (amount) => {
  if (amount >= 1000) return 25;
  if (amount >= 500) return 12;
  if (amount >= 250) return 6;
  if (amount >= 125) return 3;
  if (amount >= 62) return 2;
  if (amount >= 31) return 1;
  return 0;
};

// Create a new wallet transaction
exports.createWalletTransaction = async (req, res) => {
  try {
    const { userId, orderId, amountSpent, transactionType = "Order" } = req.body;

    // Calculate coins earned based on amount
    const coinsEarned = calculateCoins(amountSpent);

    // Get previous wallet balance for this user
    const lastTransaction = await Wallet.findOne({ userId }).sort({ createdAt: -1 });
    const previousBalance = lastTransaction ? lastTransaction.balanceCoins : 0;

    const newBalance = transactionType === "Order"
      ? previousBalance + coinsEarned
      : previousBalance; // for Refund/Adjustment, you may handle differently

    const walletTransaction = new Wallet({
      userId,
      orderId,
      amountSpent,
      coinsEarned,
      transactionType,
      balanceCoins: newBalance,
    });

    await walletTransaction.save();
    res.status(201).json(walletTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create wallet transaction", error });
  }
};

// Get all wallet transactions for a user
exports.getUserWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const walletTransactions = await Wallet.find({ userId }).populate("orderId", "coId amountSpent").sort({ createdAt: -1 });
    res.status(200).json(walletTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch wallet transactions", error });
  }
};

// Get a single wallet transaction by ID
exports.getWalletTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Wallet.findById(id).populate("userId", "name email").populate("orderId", "coId amountSpent");
    if (!transaction) return res.status(404).json({ message: "Wallet transaction not found" });
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch wallet transaction", error });
  }
};

// Update balance coins for a wallet transaction
exports.updateWalletTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { balanceCoins, coinsEarned } = req.body;

    const updatedTransaction = await Wallet.findByIdAndUpdate(
      id,
      { balanceCoins, coinsEarned },
      { new: true }
    );

    if (!updatedTransaction) return res.status(404).json({ message: "Wallet transaction not found" });

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update wallet transaction", error });
  }
};

// Delete a wallet transaction
exports.deleteWalletTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Wallet.findByIdAndDelete(id);
    if (!deletedTransaction) return res.status(404).json({ message: "Wallet transaction not found" });
    res.status(200).json({ message: "Wallet transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete wallet transaction", error });
  }
};
