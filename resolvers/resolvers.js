const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const { setCache, getCache } = require("../utils/cache");

const resolvers = {
  Query: {
    getCustomerSpending: async (_, { customerId }) => {
      const orders = await Order.find({ customerId, status: "completed" });
      const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
      const lastOrder = orders[orders.length - 1];
      const avgOrderValue = orders.length ? totalSpent / orders.length : 0;

      return {
        customerId,
        totalSpent,
        averageOrderValue: avgOrderValue,
        lastOrderDate: lastOrder ? lastOrder.orderDate : null,
      };
    },

    getTopSellingProducts: async (_, { limit }) => {
      const products = await Order.aggregate([
        { $unwind: "$products" },
        { $group: { _id: "$products.productId", totalSold: { $sum: "$products.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
      ]);
      return products.map((p) => ({ productId: p._id, totalSold: p.totalSold }));
    },

    getSalesAnalytics: async (_, { startDate, endDate }) => {
      const cacheKey = `sales:${startDate}:${endDate}`;
      const cachedData = await getCache(cacheKey);
      if (cachedData) return cachedData;

      const analytics = await Order.aggregate([
        { $match: { orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) }, status: "completed" } },
        { $group: { _id: "$status", totalRevenue: { $sum: "$totalAmount" }, completedOrders: { $sum: 1 } } },
      ]);

      await setCache(cacheKey, analytics, 600);
      return analytics;
    },

    getCustomerOrders: async (_, { customerId, limit = 5, offset = 0 }) => {
      return await Order.find({ customerId })
        .sort({ orderDate: -1 })
        .skip(offset)
        .limit(limit);
    },
  },

  Mutation: {
    placeOrder: async (_, { customerId, products }) => {
      let totalAmount = products.reduce((sum, item) => sum + item.quantity * item.priceAtPurchase, 0);

      const newOrder = new Order({
        customerId,
        products,
        totalAmount,
        orderDate: new Date().toISOString(),
        status: "pending",
      });

      await newOrder.save();
      return newOrder;
    },
  },
};

module.exports = resolvers;
