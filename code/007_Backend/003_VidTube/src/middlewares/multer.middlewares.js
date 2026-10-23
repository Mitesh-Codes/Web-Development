import multer from "multer";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const uploadTempDirectory = path.join(os.tmpdir(), "vidtube-uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync(uploadTempDirectory, { recursive: true });
            cb(null, uploadTempDirectory);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    }
})

export const upload = multer({
    storage,
    limits: { files: 2 },
});

export const cleanupUploadedFiles = (req, res, next) => {
    const uploadedFiles = [
        ...(req.file ? [req.file] : []),
        ...Object.values(req.files || {}).flat(),
    ];
    const cleanup = () => {
        for (const file of uploadedFiles) {
            try {
                if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            } catch (error) {
                console.error("Error removing temporary upload:", error);
            }
        }
    };

    res.once("finish", cleanup);
    res.once("close", cleanup);
    next();
};
