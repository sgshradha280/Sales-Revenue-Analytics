# Sales-Revenue-Analytics

1️⃣ Install Prerequisites

Make sure you have the following installed:

Node.js (LTS) → Download

MongoDB Community Edition → Install Guide

To check if you have them installed, run:
```
node -v
npm -v
mongod --version
```


2️⃣ Clone the Repository
```
git clone <YOUR_GITHUB_REPO_URL>
cd sales-revenue-analytics-api
```

3️⃣ Install Dependencies
```
npm install
```

4️⃣ Set Up MongoDB Locally

Start MongoDB (if not running already):
```
brew services start mongodb-community@7.0
```

Check if MongoDB is running:
```
mongosh
```


5️⃣ Import Sample Data

Run the script to import CSV files into MongoDB:
```
node scripts/importCSV.js
```

📡 Run the API Server

Start the GraphQL API server:
```
npm start
```



🔍 Available GraphQL Queries
1️⃣ Get Customer Spending
```
query {
  getCustomerSpending(customerId: "63f8b3d5a7b1d7f3b0a2c5e1") {
    customerId
    totalSpent
    averageOrderValue
    lastOrderDate
  }
}
```
2️⃣ Get Top-Selling Products
```
query {
  getTopSellingProducts(limit: 5) {
    productId
    name
    totalSold
  }
}
```
3️⃣ Get Sales Analytics
```
query {
  getSalesAnalytics(startDate: "2024-01-01", endDate: "2024-02-29") {
    totalRevenue
    completedOrders
    categoryBreakdown {
      category
      revenue
    }
  }
}
