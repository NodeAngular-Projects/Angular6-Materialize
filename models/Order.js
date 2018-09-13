const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  serial: {
    type: Number,
    required: true
  },
  list: [
    {
      name: {
        type: String
      },
      quantity: {
        type: Number
      },
      cost: {
        type: Number
      }
    }
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
