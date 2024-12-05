const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { dbConnection } = require("./configs/databaseConnection");
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://erp.brothers.net.in",
    ],
  })
);
app.use("/static/api/v1/", express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const version = process.env.COMPANY_VERSION_TYPE;
const versionOne = process.env.COMPANY_VERSION_NUMBER;

// common modules v1 routes 👇
// **************************************************

// Authentication
// *****************START************

app.use(
  `/api/${version + versionOne}/web/user`,
  require("./company/v1/web/routes/user/user.routes")
);

// *****************END************

//  Customer
// *****************START************
app.use(
  `/api/${version + versionOne}/web/customer`,
  require("./company/v1/web/routes/customer/customer.routes")
);
// *****************END************

//  Product
// *****************START************
app.use(
  `/api/${version + versionOne}/web/products`,
  require("./company/v1/web/routes/product/product.routes")
);
// *****************END************

//  Order
// *****************START************
app.use(
  `/api/${version + versionOne}/web/order`,
  require("./company/v1/web/routes/orders/order.routes")
);
// *****************END************

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    ...err,
    status,
    message,
  });
});

// Port setup
const port = process.env.PORT1 || 8000;
app.listen(port, async () => {
  console.log("running on ", process.env.BASE_URL + port);
  const dbConnect = await dbConnection();
  if (dbConnect) console.log("Database connected");
  else console.log("Database not connected");
});
