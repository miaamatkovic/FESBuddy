import "dotenv/config";
import Express from "express";
const app = Express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import coursesRoutes from "./routes/courses.js";
import majorsRoutes from "./routes/majors.js";
import postsRoutes from "./routes/posts.js";
import matchesRoutes from "./routes/matches.js";
import messagesRoutes from "./routes/messages.js";
import notesRoutes from "./routes/notes.js";
import path from "path";
import { fileURLToPath } from "url";
import scriptsRoutes from "./routes/scripts.js";


//middlewares
// CORS + credentials (allow cookies)
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});


app.use(Express.json()); //ako nema ovoga nemos poslat objekt za provjeru
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);

app.use(cookieParser());


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/majors", majorsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/notes", notesRoutes);
app.use("/uploads", Express.static(path.join(__dirname, "uploads")));
app.use("/api/scripts", scriptsRoutes);

app.listen(8800, ()=>{
    console.log("API working!");
});