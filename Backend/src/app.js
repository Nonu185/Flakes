const express = require('express');
const app = express();
const cors = require("cors");
const compression = require('compression');
const cookieparser = require('cookie-parser');
const authROUTER = require("./routes/auth.route");
const movieROUTER = require("./routes/movie.route");

app.use(compression());
app.use(cors({
  origin: ["https://project-1-puce-three.vercel.app", "https://flakes.onrender.com", "http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json());
app.use(cookieparser());

app.use("/api/auth", authROUTER);
app.use("/api/movies", movieROUTER);

module.exports = app;
