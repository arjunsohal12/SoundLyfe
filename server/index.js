import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet"
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import chatRoutes from "./routes/chat.js"
import messageRoutes from "./routes/message.js";
import {createPost} from "./controllers/posts.js"
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/user.js";
import Post from "./models/post.js";
import { users, posts } from "./data/index.js";
import { S3Client } from "@aws-sdk/client-s3";
import musicRoutes from "./routes/music.js"
import { createChat } from "./controllers/chat.js";
/* CONFIGURATION (middleware) */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({ limit:"30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended:true}))
app.use(cors())

/* File storage CHANGE TO AWS S3 */


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/assets");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })
const storage = multer.memoryStorage()

const upload = multer({ storage: storage });

/* Routes with files*/

app.post("/auth/register", upload.single("picture"), register) // the string is the name of the image uploading in the payload, we define it in the Form from Form.jsx
app.post("/posts", verifyToken, upload.single("picture"), createPost) // grab picture property from http call and upload
app.post("/chats/", upload.single("picture"), createChat)
/* ROUTES */

app.use("/auth", authRoutes); // Use the /auth Router from the routes/auth.js file, we import authRoutes and give the routes there the prefix "/auth"

app.use("/users", userRoutes); // Use the routes defined in routes/users.js, we import authRoutes and give the routes there the prefix "/users"

app.use("/posts", postRoutes);

app.use("/music", musicRoutes);

app.use("/chats", chatRoutes);

app.use("/message", messageRoutes)

/* MONGOOSE SETUP CHANGE TO AWS */

const port = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => console.log(`Server Port: ${port}`));
    /* Mock data only do it once */
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((err) => console.log(`${err} did not connect`))

