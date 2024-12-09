require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const route = require("./routes");

const app = express();
const PORT = process.env.PORT || 8000;

// Load swagger.yaml file
const swaggerDocument = YAML.load("./swagger.yaml");

// Apply middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.URL_FE,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

route(app);

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
