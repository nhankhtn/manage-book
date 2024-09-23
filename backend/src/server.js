require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const route = require("./routes")

const app = express();
const PORT = process.env.PORT || 8000;

// Apply middleware
app.use(morgan("dev"))

route(app);

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
})