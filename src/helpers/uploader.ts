import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../app/config";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});
const sendImageToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export const fileUploader = {
  upload,
  sendImageToCloudinary,
};
