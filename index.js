import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";

import auth from "./src/controllers/auth.controller.js";
import { configure } from "./recources/smsc/smsc_api.js";

/**
configure({
    login: "yesa5",
    password: "frvzBHv4bAmE6!8",
});
*/

config();
const PORT = 8080;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", auth);

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});
