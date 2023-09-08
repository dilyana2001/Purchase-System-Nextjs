import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  total: {
    required: true,
    type: Number,
    maxlength: 20,
  },
});

module.exports = mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);

