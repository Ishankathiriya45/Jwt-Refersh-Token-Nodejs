const multer = require("multer");
const path = require("path");

module.exports = {
    fileUpload: () => {
        const allowedExtensions = [
            "png",
            "jpg",
            "jpeg",
            "svg",
            "pdf",
            "docx",
            "glb",
        ];

        const fileFilter = (req, file, cb) => {
            const maxSize = 2 * 1024 * 1024;
            let contentLength = parseInt(req.headers['content-length'])

            const extension = path
                .extname(file.originalname)
                .toLowerCase()
                .substring(1);

            if (!allowedExtensions.includes(extension)) {
                const error = new Error(
                    `Invalid file type: "${extension}". Allowed types: ${allowedExtensions.join(
                        ", "
                    )}`
                );
                error.code = "INVALID_FILE_TYPE";
                return cb(error, false);
            } else if (contentLength > maxSize) {
                const error = new Error("File size exceeds 1MB limit")
                return cb(error, false)
            }
            cb(null, true);
        };

        return multer({
            fileFilter,
            // limits: {
            //     fileSize: 1 * 1024 * 1024, // 1 MB
            //     files: 1
            // }
        })
    },

    upload: () => {
        const storageImg = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "public/uploads/productImages")
            },

            filename: function (req, file, cb) {
                const filePart = `${file.originalname.split(".").pop()}`;
                cb(null, `${Date.now()}.${filePart}`)
            },
        })

        let allowedExtensions = [
            "png",
            "jpg",
            "jpeg",
            "svg",
            "pdf",
            "docx",
            "glb",
        ]

        const fileFilter = (req, file, cb) => {
            const maxSize = 2 * 1024 * 1024; // 2 MB
            let contentLength = parseInt(req.headers['content-length'])

            const extension = path
                .extname(file.originalname)
                .toLowerCase()
                .substring(1);

            if (!allowedExtensions.includes(extension)) {
                const error = new Error(
                    `Invalid file type: "${extension}". Allowed types: ${allowedExtensions.join(
                        ", "
                    )}`
                );
                error.code = "INVALID_FILE_TYPE";
                return cb(error, false);
            } else if (contentLength > maxSize) {
                const error = new Error("File size exceeds 1MB limit")
                return cb(error, false)
            }
            cb(null, true);
        };

        return multer({ storage: storageImg, fileFilter: fileFilter, limits: { files: 3 } })
    }
}