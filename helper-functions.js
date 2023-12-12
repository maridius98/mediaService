import fs from "fs";
import { uploadDirectoryPath } from "./directory-path.js";
import { imageMimeTypes, videoMimeTypes } from "./media.js";

export function getTypeFromMime(mimetype){
    return mimetype.split("/")[0];
}

export function formFileName(media){
    return media.file._id + media.file.ext;
}

export function isProperFormat(mimetype){
    const type = getTypeFromMime(mimetype);
    switch (type){
        case "image":
            if (imageMimeTypes.includes(mimetype)){
                return true;
            }
            return false;
        case "video":
            if (videoMimeTypes.includes(mimetype)){
                return true;
            }
            return false;
        default:
            return true;
    }
}

export function saveFile(name, buffer, prefix = '') {
    let filePath = uploadDirectoryPath;
    if (prefix) {
        filePath += `\\${prefix}`;
    }
    filePath += `\\${name}`;

    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error('Error saving the file to disk:', err);
            return {
                name: name,
                message: '',
                error: 'Error saving file to disk',
                status : 500
            }
        }
    });

    return { 
        name: name,
        message: 'File uploaded successfully',
        error: '',
        status: 200
    }
};

export function getFileExtension(filename){
    const parts = filename.split(".");
    if (parts.length === 1) {
        return "";
    } else {
        return "." + parts[parts.length - 1];
    }
}


export function isImage(type){
    if (type === "image"){
        console.log(type + 'DA')
        return true;
    }
    console.log(type + 'NE')
    return false; 
}

export function isVideo(type){
    if (type === "video"){
        return true;
    }
    return false; 
}

export function isAllowedType(media_use_case, type){
    switch (media_use_case) {
        case "page_media":
            return true;
        case "profile_image":

    }
}

