const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

// GET -> localhost:5000/api/order?offset=2&limit=10
module.exports.getAll = async function(req, res) {
  const query = {
    user: req.user.id
  };

  // Start date
  if (req.query.start) {
    query.date = {
      // greater then or equal
      $gte: req.query.start
    }
  }

  // End date
  if (req.query.end) {
    if (!query.date) {
      query.date = {};
    }
    
    // less then or equal
    query.date['$lte'] = req.query.end;
  }

  if (req.query.serial) {
    query.serial = +req.query.serial;
  }

  try {
    const orders = await Order
      .find(query)
      .sort({ date: -1 })
      .skip(+req.query.offset)
      .limit(+req.query.limit);

    res.status(200).json(orders);
  } catch (err) {
    errorHandler(res, err);
  }
}

module.exports.create = async function(req, res) {
  try {
    const lastOrder = await Order
      .findOne({ user: req.user.id })
      .sort({ date: -1 });
    const maxSerial = lastOrder ? lastOrder.serial : 0;

    const order = await new Order({
      list: req.body.list, 
      user: req.user.id,
      serial: maxSerial + 1
    }).save();

    res.status(201).json(order);
  } catch (err) {
    errorHandler(res, err);
  }
}