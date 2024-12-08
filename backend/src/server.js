require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const route = require("./routes");

const app = express();
const PORT = process.env.PORT || 8000;

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

route(app);

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
