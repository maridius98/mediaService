import sharp from "sharp";
import { formFileName, saveFile } from "./helper-functions.js";


const xsmallSize = 200;
const smallSize = 500;
const mediumSize = 700;
const largeSize = 1000;

const ascendingSizeList = [
    {
        size : xsmallSize,
        identifier : "extra_small"
    },
    {
        size : smallSize,
        identifier : "small"
    },
    {
        size : mediumSize,
        identifier : "medium"
    },
    {
        size : largeSize,
        identifier : "large"
    },
];

export async function handleImageThumbnail(media){
    saveFile(formFileName(media), media.buffer, media.prefix);
    const sharpImage = sharp(media.buffer);
    const {height, width} = await sharpImage.metadata();
    if (media.file.ext === '.gif'){

    } else {
        for (const p of ascendingSizeList) {
            if (p.size > (height > width ? height: width)){
                break;
            }
            const targetDimensions = {
                width: p.size,
                height: p.size
            }
            const compressedImage = await compressImage(targetDimensions, sharpImage, media.resizeOptions);
            saveFile(formFileName(media), compressedImage, 'thumbnail\\' + p.identifier);
        }
    }
}

export async function compressImage(targetDimensions, sharpImage, resizeOptions){
    try {
        const outputBuffer = await sharpImage
            .resize(targetDimensions.width, targetDimensions.height, resizeOptions)
            .toBuffer();
        return outputBuffer;
    } catch (error) {
        console.error(`Error compressing the image`, error);
        throw error;
    }
}
