import { User } from "../models/user.model.js"

const isDriver = async (req, res, next) => {
    const user = await User.findOne({ _id: req.userId });
    
    if (user.role !== "logistian") {
        return res.status(403).send({ message: "Logistian role required" });
    }

    next();
};


export default isDriver;