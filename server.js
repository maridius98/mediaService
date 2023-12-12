import db from './db.js';
import { Media } from './media.js';
import { getFileExtension, } from './helper-functions.js';
import express from 'express';
import path from 'path';
import multer from 'multer';
import { baseDirectoryPath } from './directory-path.js';
import exifParser from 'exif-parser';
import { ObjectId } from 'mongodb';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(baseDirectoryPath, "index.html"));
})
// receive file with upload token... send upload token to API for decryption... receive true/false... if true proceed with upload 
app.post('/upload', upload.single('file'), async (req, res) => {
    const tokenResponse = {
        status: 200,
        media_use_case: "profile_cover_image",
        size_limit: 10485760,
        upload_quota: 104857600,
        id_user: 5
    }

    const contentType = req.file.mimetype;
    console.log(contentType);

    if (tokenResponse.status != 200){
        return res.status(tokenResponse.status).json({error : `Invalid token`});
    }  

    const fileExtension = getFileExtension(req.file.originalname);

    if (tokenResponse.size_limit < req.file.size){
        return res.status(400).json({error: "Media file too large"});
    }
    if (tokenResponse.upload_quota < req.file.size){
        return res.status(400).json({error: "User upload quota exceeded"})
    }

    const objectId = new ObjectId();
    console.log(objectId);

    const newFile = {
        _id: objectId,
        date: new Date(),
        size: req.file.size,
        type: req.file.mimetype,
        originalname: req.file.originalname,
        ext: fileExtension,
        media_use_case: tokenResponse.media_use_case,
        id_user: tokenResponse.id_user
    };

    const media = new Media(newFile, req.file.buffer);
    if (!media.validate()) {
        res.status(500).json({ error: "Invalid type"});
    } 
       
    try {
        media.preprocess();
        db.collection("chatting_app").insertOne(newFile);
        console.log(`Saved file with id ${newFile._id} to database`);
        res.status(200).json({ message: `File uploaded successfully.`});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error : "An error occured while saving the file."});
    }
});

app.get("/thumb/:link", (req, res) => {
    
})

//app.get('/download', uploads.)

app.listen(3000);


