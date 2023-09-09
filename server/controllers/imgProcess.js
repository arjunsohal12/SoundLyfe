import {PutObjectCommand, GetObjectCommand , S3Client } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import dotenv from "dotenv";
import crypto from 'crypto'

dotenv.config();

const bucketName= process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    }
})

const randomImageName = (bytes) => (crypto.randomBytes(bytes).toString('hex'))

const uploadToS3 = async (image) => {
    const imgName = randomImageName(32)
    console.log(imgName)
    const params = {
        Bucket: bucketName,
        Key: imgName,
        Body: image.buffer,
        ContentType: image.mimetype
    }
    const command = new PutObjectCommand(params)
    try {
        await s3.send(command)
        return imgName
    }
    catch (err) {
        console.log(err)
    }

}

const getImageURL = async (picturePath) => {
    try {

        // const getObjectParams = {
        //     Bucket: bucketName,
        //     Key: picturePath
        // }
        
        // const command = new GetObjectCommand(getObjectParams)
        // const url = await getSignedUrl(s3, command, {expiresIn: 1440})
        const url = `https://tunetalkimg.s3.ca-central-1.amazonaws.com/${picturePath}`
        return url
    }
    catch (err) {
        console.log(err)
    }
}

const getImageReq = async (req, res) => {
    try {

        const {picturePath} = req.body;
        const url = getImageURL(req.body)
        req.status(200).json(url)
    }
    catch (err) {
        req.status(404).json({error: err})
    }
    

}
export {uploadToS3, getImageURL, getImageReq}