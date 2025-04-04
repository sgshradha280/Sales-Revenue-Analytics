const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

const resolvers = {
  Query: {
    async getCustomerSpending(_, { customerId }) {
      const result = await Order.aggregate([
        { $match: { customerId: customerId, status: "completed" } },
        { 
          $group: {
            _id: "$customerId",
            totalSpent: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
            lastOrderDate: { $max: "$orderDate" }
          }
        }
      ]);

      if (result.length === 0) return null;

      return {
        customerId: result[0]._id,
        totalSpent: result[0].totalSpent,
        averageOrderValue: result[0].avgOrderValue,
        lastOrderDate: result[0].lastOrderDate
      };
    },

    async getTopSellingProducts(_, { limit }) {
      const result = await Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.quantity" }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo"
          }
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            productId: "$_id",
            name: "$productInfo.name",
            totalSold: 1
          }
        }
      ]);

      return result;
    },

    async getSalesAnalytics(_, { startDate, endDate }) {
      const result = await Order.aggregate([
        {
          $match: {
            orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
            status: "completed"
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            completedOrders: { $sum: 1 }
          }
        }
      ]);

      const categoryBreakdown = await Order.aggregate([
        { $unwind: "$products" },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "productInfo"
          }
        },
        { $unwind: "$productInfo" },
        {
          $group: {
            _id: "$productInfo.category",
            revenue: { $sum: { $multiply: ["$products.quantity", "$products.priceAtPurchase"] } }
          }
        },
        { $project: { category: "$_id", revenue: 1 } }
      ]);

      return {
        totalRevenue: result[0]?.totalRevenue || 0,
        completedOrders: result[0]?.completedOrders || 0,
        categoryBreakdown
      };
    }
  }
};

module.exports = resolvers;
