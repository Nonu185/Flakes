const express = require("express");
const movieRouter = express.Router();
const { searchMovies, getMovieById, getTrendingMovies } = require("../controller/movie.controller");

movieRouter.get("/trending", getTrendingMovies);
movieRouter.get("/search", searchMovies);
movieRouter.get("/:id", getMovieById);

module.exports = movieRouter;
