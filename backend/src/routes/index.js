const bookRouter = require("./bookRoutes");
const customerRouter = require("./customerRoutes");
const ruleRouter = require("./ruleRoutes");
const reportRouter = require("./reportRoutes");

function route(app) {
    app.use("/api/books", bookRouter);
    app.use("/api/customers", customerRouter);
    app.use("/api/reports", reportRouter);
    app.use("/api/rules", ruleRouter);
}

module.exports = route;
