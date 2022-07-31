import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

const authorized = (req, res, next) => {
    let token = req.headers.token;
  
    if (!token) {
      return res.status(403).send({ message: "No token provided" });
    }
  
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) return res.status(401).send({ message: "Unauthorized" });

      req.userId = decoded._id;
      next();
    });
};

export default authorized;