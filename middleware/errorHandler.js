const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {

    const statusCode = err.status ? err.status : 500;

    console.log(statusCode)
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.status(statusCode).json({ title: "Validation Failed Found", message: err.message, stackTrace: err.stack });
            break;
        case constants.NOT_FOUND:
            res.status(statusCode).json({ title: "Not Found", message: err.message, stackTrace: err.stack });
            break;
        case constants.UNAUTHORIZED:
            res.status(statusCode).json({ title: "Unauthorized", message: err.message, stackTrace: err.stack });
            break;
        case constants.FORBIDDEN:
            res.status(statusCode).json({ title: "Forbidden", message: err.message, stackTrace: err.stack });
            break
        case constants.SERVER_ERROR:
            res.status(statusCode).json({ title: "Server Error", message: err.message, stackTrace: err.stack });
            break
        default:
            console.log("All things is good")
            break;
    }
}

module.exports = errorHandler;