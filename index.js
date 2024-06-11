const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth")
const projectsRoute = require("./routes/projects")

const db = require("./config/db");

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();

app.use(express.json());
const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(cookieParser());


app.use("/api/auth", authRoute)
app.use("/api/projects", projectsRoute)


app.disable("x-powered-by");
app.listen(8000, () => {
    console.log("Connected to Backend!");
});
