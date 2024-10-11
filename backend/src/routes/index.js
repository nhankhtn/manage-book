const bookRouter = require("./bookRoutes");

function route(app) {
    app.use("/books", bookRouter);
}

module.exports = route;
