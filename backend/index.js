import Express from "express";
const app = Express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import coursesRoutes from "./routes/courses.js";
import majorsRoutes from "./routes/majors.js";

//middlewares
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
});
app.use(Express.json()); //ako nema ovoga nemos poslat objekt za provjeru
app.use(
    cors({
        origin:"http://localhost:3000",
})
);

app.use(cookieParser());


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/majors", majorsRoutes);


app.listen(8800, ()=>{
    console.log("API working!");
});