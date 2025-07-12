require("dotenv").config();
const express = require("express");
const db = require("./models");
const path = require("path");
const clc = require("cli-color");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");
const {
  LoggingMiddleware: { apiLogger },
} = require("./middleware");
const morgan = require("morgan");
const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: false, limit: "500mb" }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(morgan("combined"));
if (global.config.run_mode !== "PROD") {
  app.use(apiLogger);
}
app.use("/api", require("./router"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${clc.green.underline(port)}`);
});
