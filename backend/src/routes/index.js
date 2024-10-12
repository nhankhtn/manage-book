const bookRouter = require("./bookRoutes");
const customerRouter = require("./customerRoutes");

function route(app) {
    app.use("/api/books", bookRouter);
    app.use("/api/customers", customerRouter);
}

module.exports = route;
