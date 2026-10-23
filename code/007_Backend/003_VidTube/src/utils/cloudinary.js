import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const getCloudinaryAssetFromUrl = (assetUrl) => {
    try {
        const pathname = new URL(assetUrl).pathname;
        const uploadMarker = "/upload/";
        const uploadIndex = pathname.indexOf(uploadMarker);
        if (uploadIndex === -1) return null;

        const resourceType = pathname.slice(0, uploadIndex).split("/").filter(Boolean).at(-1);
        const pathParts = pathname.slice(uploadIndex + uploadMarker.length).split("/").filter(Boolean);
        if (pathParts[0] && /^v\d+$/.test(pathParts[0])) pathParts.shift();
        if (!resourceType || pathParts.length === 0) return null;

        const filename = pathParts.pop();
        pathParts.push(filename.replace(/\.[^.]+$/, ""));
        return { publicId: pathParts.join("/"), resourceType };
    } catch {
        return null;
    }
};


const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    const removeLocalFile = () => {
        try {
            if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        } catch (error) {
            console.error("Error removing temporary upload:", error);
        }
    };

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("File uploaded to Cloudinary successfully. File src: " + response.url);
        removeLocalFile();
        return response;
    } catch (error) {
        removeLocalFile();
        return null;
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if(!publicId) return null;
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log("File deleted from Cloudinary successfully. Result: " + result.result);
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary, getCloudinaryAssetFromUrl };
