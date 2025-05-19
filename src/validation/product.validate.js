const Joi = require("joi");

const ProductValidate = {
    createProduct: Joi.object().keys({
        name: Joi
            .string()
            .required()
            .messages({
                "any-required": "name is mandatory",
                "string.empty": "name cannot be empty",
            }),

        price: Joi
            .number()
            .required()
            .messages({
                "number.base": "price is mandatory",
            }),

        rating: Joi
            .number()
            .required()
            .messages({
                "number.base": "rating is mandatory",
            }),
    })
}

module.exports = {
    ProductValidate,
}