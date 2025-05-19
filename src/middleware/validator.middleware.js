const { responseMsg } = require("../responses");
const node_env = process.env.RUN_MODE;

const joyValidate = (schema, fileKey) => {
    return (req, res, next) => {
        let validationData = { ...req.body };

        if (fileKey) {
            validationData[fileKey] = req.file ? req.file : req.files;
        }

        let { error } = schema.validate(validationData)

        if (!error) {
            next()
        } else {
            let { details } = error;
            let message = details.map((i) => i.message).join(',')

            if (node_env == 'DEV' || node_env == 'LOCAL') {
                return res.status(422).send(responseMsg.validationError(0, message))
            } else {
                return res.status(422).send(responseMsg.validationError(0, message))
            }
        }
    }
}

module.exports = {
    joyValidate,
}