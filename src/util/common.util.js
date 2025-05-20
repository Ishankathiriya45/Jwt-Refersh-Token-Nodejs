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
    }
}