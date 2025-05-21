const crypto = require('node:crypto')

const isEmpty = (value) => {
    if (value === undefined || value === null) return true;

    if (typeof value === "string") {
        return ["", "null", "undefine", "0", "NaN"].includes(value.trim());
    }

    if (Array.isArray(value) || typeof value === "object") {
        return Object.keys(value).length === 0;
    }
};

module.exports = {
    isEmpty,
    generateFileName: (name) => {
        const fileParts = name.split(".").pop()
        return `${Date.now()}.${fileParts}`;
    },

    getFileUrl: (folderName, fileName) => {
        return `${process.env["URL_" + process.env.RUN_MODE]}/public/uploads/${folderName}/${fileName}`;
        // return `https://${bucketName}.s3.${region}.amazonaws.com/${RUN_MODE.toLowerCase()}/${folderName}/${fileName}`;
    },

    generateRandomCode: (prefix = null) => {
        let randomCode = prefix
            ? `${prefix}-${crypto.randomBytes(3).toString("hex")}`
            : `${crypto.randomBytes(3).toString("hex")}`
        return randomCode;
    },

    generateOtp: () => {
        return Math.floor(1000 + Math.random() * 9000)
    },

    fetchRecord: async (model, options = {}, paginate = false, unscoped = false) => {
        let page = 1, limit = 10;
        const queryMethod = unscoped ? model.unscoped() : model;

        let rows = []
        if (paginate == true) {
            page = parseInt(options.page) || 1;
            limit = parseInt(options.limit) || 10;

            let offset = (page - 1) * limit;
            options.limit = limit;
            options.offset = offset;
            // delete options.page
            // delete options.limit
            // delete options.paginate
            rows = await queryMethod.findAll(options)
        } else {
            return await queryMethod.findAll(options)
        }

        let count = await queryMethod.count(options)
        let totalPages = Math.ceil(count / options.limit)

        return {
            totalItems: count,
            totalPages,
            page,
            hasPrevious: page > 1,
            hasNext: page < totalPages,
            previous: page > 1 ? page - 1 : null,
            next: page < totalPages ? page + 1 : null,
            rows,
        }
    },

    getFilterCluse: (filterData) => {
        const { fields, search } = filterData;
        const first = search.trim().split(" ")
    }
}