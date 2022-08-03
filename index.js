import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";

import auth from "./src/controllers/auth.controller.js";
import user from "./src/controllers/user.controller.js";
import order from "./src/controllers/order.controller.js";
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
app.use(cors());

app.use("/auth", auth);
app.use("/user", user);
app.use("/orders", order);

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});
