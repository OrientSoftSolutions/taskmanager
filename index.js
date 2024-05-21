const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth")
const projectsRoute = require("./routes/projects")

const db = require("./config/db");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute)
app.use("/api/projects", projectsRoute)


app.disable("x-powered-by");
app.listen(8000, () => {
    console.log("Connected to Backend!");
});
