import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.API_KEY_CLOUDNARY,
  api_secret: process.env.API_SECRET_KEY_CLOUDNARY,
});

const uploadImage = async (imagePath) => {
  const options = {
    use_filename: false,
    unique_filename: false,
    resource_type: "image",
    allowed_formats: "png,jpeg,jpg,webp",
    overwrite: true,
  };
  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log("Upload da imagem feita com sucesso");
    return result;
  } catch (error) {
    console.error(error);
  }
};

export default uploadImage;
