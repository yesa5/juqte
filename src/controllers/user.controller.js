import { Router } from "express";

import { User } from "../models/user.model.js";
import authorized from "../middlewares/is.authorized.js";

const router = Router();

router.get(
    "/info",
    authorized,
    (req, res) => {
        User.findOne({ _id: req.userId }, ((err, arr) => {
            if (err) return res.status(400).send({ message: err });

            return res.json(arr);
        }));
    }
);

router.put(
    "/",
    authorized,
    async (req, res) => {
        try {
            let user = await User.findOne({ _id: req.userId });

            if (req.body.personal) {
                let personal = req.body.company;

                if (personal.phone) user.phone = personal.phone;
                if (personal.surname) user.surname = personal.surname;
                if (personal.name) user.name = personal.name;
                if (personal.iin) user.iin = personal.iin;
            }

            if (req.body.company) {
                let company = req.body.company;

                if (company.name) user.company.name = company.name;
                if (company.bin) user.company.bin = company.bin;
                if (company.account) user.company.account = company.account;

                let director = company.director;
                if (director) user.company.director = director;

                let contacts = company.contacts;
                if (contacts) user.company.contacts = contacts;
            }

            await user.save();

            return res.send();
        } catch (err) {
            return res.status(400).send({ message: err });
        }
    }
);

export default router;