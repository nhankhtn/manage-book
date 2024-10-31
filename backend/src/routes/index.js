const bookRouter = require("./bookRoutes");
const customerRouter = require("./customerRoutes");
const ruleRouter = require("./ruleRoutes");

function route(app) {
    app.use("/api/books", bookRouter);
    app.use("/api/customers", customerRouter);
    app.use("/api/rules", ruleRouter);
}

module.exports = route;
