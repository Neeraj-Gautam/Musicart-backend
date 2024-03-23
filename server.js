require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

const app = express();

app.use(express.json());
app.use(cors());

//connect to db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Db connected!"))
  .catch((error) => console.log("Failed to connect", error));

//health api
app.get("/health", (req, res) => {
  res.json({
    service: "job listing server",
    status: "Active",
    time: new Date(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
