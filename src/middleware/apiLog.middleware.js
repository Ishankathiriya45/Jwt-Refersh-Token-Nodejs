const { LoggerUtil: { logger } } = require('../util')

const apiLogger = (req, res, next) => {
    const { method, originalUrl, body: requestBody } = req;
    const start = Date.now();

    const oldSend = res.send;
    let responseBody;

    res.send = function (body) {
        responseBody = body;
        return oldSend.call(this, body);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info({
            method,
            url: originalUrl,
            requestBody: requestBody,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            responseBody:
                res.statusCode != 200 && res.statusCode != 304 ? responseBody : {},
        });
    });

    next();
}

module.exports = {
    apiLogger,
}
