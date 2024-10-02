const siteRouter = require("./site");
const bookRouter = require("./bookRoutes");

function route(app) {
    app.use("/", siteRouter);
    app.use("/books", bookRouter);
}

module.exports = route;
