const bookRouter = require("./bookRoutes");
const customerRouter = require("./customerRoutes");

function route(app) {
    app.use("/books", bookRouter);
    app.use("/customers", customerRouter);
}

module.exports = route;
