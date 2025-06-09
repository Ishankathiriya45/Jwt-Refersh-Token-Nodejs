const crypto = require('node:crypto');
const { Op } = require('sequelize');

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

    fetchRecords: async (
        model,
        options = {},
        paginate = false,
        unscoped = false,
    ) => {
        let currentPage = 1,
            pageSize = 10;
        const queryMethod = unscoped ? model.unscoped() : model;

        let rows = [];
        if (paginate == true) {
            currentPage = parseInt(options.currentPage) || 1;
            pageSize = parseInt(options.pageSize) || 10;

            const offset = (currentPage - 1) * pageSize;
            options.limit = pageSize;
            options.offset = offset;
            delete options.currentPage;
            delete options.pageSize;
            delete options.is_paginate;
            rows = await queryMethod.findAll(options);
        } else {
            return await queryMethod.findAll(options);
        }

        const count = await queryMethod.count(options);
        const totalPages = Math.ceil(count / options.limit);

        return {
            totalItems: count,
            totalPages,
            currentPage,
            hasPrevious: currentPage > 1,
            hasNext: currentPage < totalPages,
            previous: currentPage > 1 ? currentPage - 1 : null,
            next: currentPage < totalPages ? currentPage + 1 : null,
            rows,
        };
    },

    getFilterCluse: (filterData) => {
        const { fields, search } = filterData;
        // let first = search.trim()
        return fields.includes("name")
            ?
            { name: { [Op.like]: `%${search}%` } }
            : {}
    },

    generateRoomName: (data, isPrivate) => {
        if (isPrivate) {
            const sortedIds = [data.user1, data.user2].sort();
            const roomName = `private_${sortedIds[0]}_${sortedIds[1]}`;
            return roomName;
        }
    },

    capitalize: (str) =>
        str
            ? str.charAt(0).toUpperCase().trim() + str.slice(1).toUpperCase().trim()
            : str

}