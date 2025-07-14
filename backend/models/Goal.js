// models/Goal.js
const mongoose = require('mongoose');
const GoalSchema = new mongoose.Schema({
  userId: String,
  title: String,
  targetAmount: Number,
  savedAmount: Number,
});
module.exports = mongoose.model('Goal', GoalSchema);
