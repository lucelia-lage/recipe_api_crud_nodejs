const express = require("express");
const mongoose = require("mongoose");
const recipeRouter = require("./router/recipeRouter");
const ingredientRouter = require("./router/ingredientRouter");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(recipeRouter);
app.use(ingredientRouter);

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }else {
  console.log(`Connecté sur le port ${process.env.PORT}`);
}
});

mongoose.connect(process.env.URL_BDD);
