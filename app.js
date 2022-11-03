"use strict";
/** Simple demo Express app. */

const express = require("express");
const app = express();

const itemRoutes = require("./item-router.js");

app.use(express.json());

app.use("/items", itemRoutes);

module.exports = app;
