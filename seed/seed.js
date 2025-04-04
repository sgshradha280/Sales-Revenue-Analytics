const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
require("dotenv").config();


const Customer = require("./models/customer.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));


const importCSV = async (filePath, model) => {
  const data = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => data.push(row))
    .on("end", async () => {
      try {
        await model.insertMany(data);
        console.log(`Successfully imported ${data.length} records into ${model.collection.collectionName}`);
        mongoose.connection.close();
      } catch (err) {
        console.error(` Error importing ${filePath}:`, err);
      }
    });
};

const runImport = async () => {
  console.log("tarting CSV Import...");
  await importCSV(path.join(__dirname, "/customers.csv"), Customer);
  await importCSV(path.join(__dirname, "/products.csv"), Product);
  await importCSV(path.join(__dirname, "/orders.csv"), Order);
};

runImport();
