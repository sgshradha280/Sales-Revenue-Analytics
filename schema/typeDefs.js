const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Customer {
    id: ID!
    name: String!
    email: String!
    age: Int!
    location: String!
    gender: String!
  }

  type Product {
    id: ID!
    name: String!
    category: String!
    price: Float!
    stock: Int!
  }

  type Order {
    id: ID!
    customerId: ID!
    products: [OrderProduct!]!
    totalAmount: Float!
    orderDate: String!
    status: String!
  }

  type OrderProduct {
    productId: ID!
    quantity: Int!
    priceAtPurchase: Float!
  }

  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String!
  }

  type TopProduct {
    productId: ID!
    name: String!
    totalSold: Int!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    categoryBreakdown: [CategoryRevenue!]!
  }

  type CategoryRevenue {
    category: String!
    revenue: Float!
  }

  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getTopSellingProducts(limit: Int!): [TopProduct]
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
    getCustomerOrders(customerId: ID!, limit: Int, offset: Int): [Order]!
  }

  type Mutation {
    placeOrder(customerId: ID!, products: [OrderProductInput!]!): Order!
  }

  input OrderProductInput {
    productId: ID!
    quantity: Int!
    priceAtPurchase: Float!
  }
`;

module.exports = typeDefs;
