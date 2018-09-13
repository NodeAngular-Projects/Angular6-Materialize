const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    default: ''
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;
