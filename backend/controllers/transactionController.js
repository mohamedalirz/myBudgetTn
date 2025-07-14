const Transaction = require('../models/Transaction');

exports.getAll = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id });
  res.json(transactions);
};

exports.add = async (req, res) => {
  const transaction = new Transaction({ ...req.body, user: req.user.id });
  await transaction.save();
  res.status(201).json(transaction);
};
