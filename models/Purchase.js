import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 100,
    required: true,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  price: {
    type: String,
    maxlength: 100,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  numberOfTable: {
    type: Number,
    required: true,
  },
  isKitchen: {
    type: Boolean,
    required: true,
  },
  orderPurchase: {
    type: Number,
  },
  purchased: {
    type: Boolean,
    default: false,
  },
  dateOfPurchase: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);

