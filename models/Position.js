const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  category: {
    ref: 'categories',
    type: Schema.Types.ObjectId
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
});

const Position = mongoose.model('positions', positionSchema);

module.exports = Position;
