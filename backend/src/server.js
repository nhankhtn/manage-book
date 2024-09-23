require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const route = require("./routes")

const app = express();
const PORT = process.env.PORT || 8000;

// Apply middleware
app.use(morgan("dev"))
app.use(cors({
    origin: process.env.URL_FE,
}))

route(app);

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
})