const Transaction = require('../models/Transaction');

// Get all transactions for the user
exports.getAll = async (req, res) => {
  try {
    const userId = req.user.id; // assuming auth middleware sets req.user
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new transaction for the user
exports.add = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, category, type, date, description } = req.body;

    const newTransaction = new Transaction({
      user: userId,
      amount,
      category,
      type,
      date,
      description,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
