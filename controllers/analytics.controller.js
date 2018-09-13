const moment = require('moment');
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.overview = async function (req, res) {
  try {
    const allOrders = await Order
      .find({
        user: req.user.id
      })
      .sort({
        date: 1
      });
    const ordersMap = getOrdersMap(allOrders);
    const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];

    const yesterdayOrdersNumber = yesterdayOrders.length;
    const totalOrdersNumber = allOrders.length;
    const daysNumber = Object.keys(ordersMap).length;
    const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(1);
    const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);

    const totalGain = calculatePrice(allOrders).toFixed(2);
    const gainPerDay = totalGain / daysNumber;
    const yesterdayGain = calculatePrice(yesterdayOrders).toFixed(2);
    const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
    const compareGain = yesterdayGain - gainPerDay;
    const compareOrdersNumber = yesterdayOrdersNumber - ordersPerDay;

    res.status(200).json({
      gain: {
        percent: Math.abs(+gainPercent),
        compare: Math.abs(+compareGain),
        perDay: +gainPerDay,
        yesterday: +yesterdayGain,
        isHigher: gainPercent >= 0
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareOrdersNumber),
        perDay: +ordersPerDay,
        yesterday: +yesterdayOrdersNumber,
        isHigher: ordersPercent >= 0
      }
    });
  } catch (err) {
    errorHandler(res, err);
  }
}

module.exports.analytics = async function (req, res) {
  try {
    const allOrders = await Order
      .find({
        user: req.user.id
      })
      .sort({
        date: 1
      });
    const ordersMap = getOrdersMap(allOrders);

    const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

    const chart = Object.keys(ordersMap).map(label => {
      const gain = calculatePrice(ordersMap[label]);
      const order = ordersMap[label].length;

      return {
        label,
        order,
        gain
      }
    });

    res.status(200).json({
      average,
      chart
    })
  } catch (err) {
    errorHandler(res, err);
  }
}

function getOrdersMap(orders = []) {
  const daysOrders = {};
  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY');

    if (date === moment().format('DD.MM.YYYY')) {
      return;
    }

    if (!daysOrders[date]) {
      daysOrders[date] = []
    }

    daysOrders[date].push(order);
  });

  return daysOrders;
}

function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return orderTotal += item.cost * item.quantity;
    }, 0);

    return total += orderPrice;
  }, 0);
}