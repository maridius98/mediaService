import { getTypeFromMime, saveFile, isImage, isProperFormat } from "./helper-functions.js";
import { compressImage, handleImageThumbnail } from "./thumbnail.js";
import sharp from "sharp";

export const videoMimeTypes = [
    'video/mp4',
    'video/x-msvideo',
    'video/x-matroska',
    'video/quicktime',
    'video/x-ms-wmv',
    'video/x-flv',
    'video/webm'
];

export const imageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/webp'
];

export class Media {
    media_use_case;
    prefix;
    allowedTypes;
    targetDimensions;
    resizeOptions;
    file;
    buffer;
    preprocess;

    constructor(file, buffer){
        this.file = file;
        this.media_use_case = file.media_use_case;
        this.buffer = buffer;
        switch (this.media_use_case) {
            case "page_media":
                this.prefix = "pages";
                this.allowedTypes = ["image", "video", "media"];
                this.resizeOptions = { fit: 'inside'};
                this.preprocess = this.pageMediaPreprocess;
                break;
            case "profile_image":
                this.targetDimensions = {
                    width : 500,
                    height : 500 
                };
                this.prefix = "user\\pfp";
                this.allowedTypes = ["image"];
                this.resizeOptions = { cover: 'cover'};
                this.preprocess = this.profileImagePreprocess;
                break;
            case "profile_cover_image":
                this.targetDimensions = {
                    width : 2560,
                    height : 1440 
                };
                this.prefix = "user\\cover";
                this.allowedTypes = ["image"];
                this.resizeOptions = { cover: 'cover'};
                this.preprocess = this.profileCoverPreprocess;
                break;
            case "group_icon":
                this.targetDimensions = {
                    width : 256,
                    height : 256 
                };
                this.prefix = "assets";
                this.allowedTypes = ["image"];
                this.resizeOptions = { cover: 'cover'};
                this.preprocess = this.groupIconPreprocess;
                break;
            case "group_cover_image":
                this.targetDimensions = {
                    width : 2560,
                    height : 1440 
                };
                this.prefix = "assets";
                this.allowedTypes = ["image"];
                this.resizeOptions = { cover: 'cover'};
                this.preprocess = this.groupCoverPreprocess;
                break;
            case "forum_media":
                this.targetDimensions = {
                    width: 200,
                    height: 200
                };
                this.prefix = "forum";
                this.allowedTypes = ["image", "video", "media"];
                this.resizeOptions = { fit: 'inside'};
                this.preprocess = this.forumMediaPreprocess;
                break;
            default:
                this.media_use_case = "invalid";
        }
    }

    validate() {
        if (this.media_use_case === "invalid"){
            return false;
        }
        if (this.allowedTypes.includes(this.getType())){
            if (isProperFormat(this.getMime())){
                return true;
            }
        }
        return false;
    };

    getMime(){
        return this.file.type;
    }

    getType(){
        return getTypeFromMime(this.file.type);
    }

    pageMediaPreprocess(){
        if (isImage(this.getType())){
            handleImageThumbnail(this);
        }

        // } else if (videoMimeTypes.includes(this.file.type)) {
        //     handleVideoThumbnail(this.file);
        // } else  {
        //     handleMediaThumbnail(this.file);
        // }
    }

    profileImagePreprocess(){
        this.imageNoThumbnailPreprocess();
    }

    profileCoverPreprocess(){
        this.imageNoThumbnailPreprocess();
    }

    groupIconPreprocess(){
        this.imageNoThumbnailPreprocess();
    }

    groupCoverPreprocess(){
        this.imageNoThumbnailPreprocess();
    }

    forumMediaPreprocess(){
        if (isImage(this.file)){
            this.imageNoThumbnailPreprocess();
        }
    }

    async imageNoThumbnailPreprocess(){
        const croppedImage = await compressImage(this.targetDimensions, sharp(this.buffer), this.prefix);
        saveFile(formFileName(this), croppedImage, this.prefix);
    }

}