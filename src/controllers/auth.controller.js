import { Router } from "express";
import OTP from "otp";
import jwt from "jsonwebtoken";

import { send_sms } from "../../recources/smsc/smsc_api.js";
import { Otp } from "../models/otp.model.js";
import { User } from "../models/user.model.js";

const router = Router();

router.post(
    "/register",
    async (req, res) => {
        const { iin, phone, name, surname, role } = req.body;
        
        try {
            const user = new User({
                iin,
                phone,
                name,
                surname,
                role,
            });
            await user.save();
            
            const otp = new Otp({
                code: "0000",
                phone,
            });
            await otp.save();
            
            return res.send({ message: "User registered" });
        } catch (err) {
            return res.status(400).send({ message: err });
        }

        /**
        const code = (new OTP()).totp();
        send_sms({
            phones : ["77759872183"],
            mes : code
        }, async (data, raw, err, code) => {
            if (err) return res.status(500).send(err);
            
            try {
                const otp = new Otp({
                    code,
                    phone,                
                });
                await otp.save();
    
                const user = new User({
                    iin,
                    phone,
                    name,
                    surname,
                    role,
                });
                await user.save();
                
                return res.send({ message: "User registered" });
            } catch (err) {
                return res.status(500).send({ message: err });
            }
        });
        */
    }
);

router.put(
    "/register/verify",
    async (req, res) => {
        const { code } = req.body;

        try {
            const otp = await Otp.findOne({ code }).sort({ _id: -1 });
            if (!otp) {
                return res.status(400).send({ message: "Invalid code" });
            }

            if (otp.expirationDate < new Date()) {
                return res.status(400).send({ message: "Invalid code" });
            }

            const user = await User.findOne({ phone: otp.phone });
            if (!user) {
                return res.status(400).send({ message: "Invalid code" });
            }
            
            user.activated = true;
            await user.save();

            return res.send({ message: "User registration verified" });
        } catch (err) {
            return res.status(400).send({ message: err });
        }
    }
);

router.post(
    "/login",
    async (req, res) => {
        const { phone } = req.body;

        try {
            const otp = new Otp({
                code: "0000",
                phone,                
            });
            await otp.save();
            
            return res.send({ message: "Logging in" });
        } catch (err) {
            return res.status(400).send({ message: err });
        }

        /**
        const code = (new OTP()).totp();
        send_sms({
            phones : [phone],
            mes : code
        }, async (data, raw, err, code) => {
            if (err) return res.status(500).send(err);
            
            try {
                const otp = new Otp({
                    code,
                    phone,                
                });
                await otp.save();
                
                return res.send({ message: "Logged in" });
            } catch (err) {
                return res.status(500).send({ message: err });
            }
        });
        */
    }
);

router.put(
    "/login/verify",
    async (req, res) => {
        const { code } = req.body;

        try {
            const otp = await Otp.findOne({ code }).sort({ _id: -1 });
            if (!otp) {
                return res.status(400).send({ message: "Invalid code" });
            }

            if (otp.expirationDate < new Date()) {
                return res.status(400).send({ message: "Invalid code" });
            }

            const user = await User.findOne({ phone: otp.phone });
            if (!user) {
                return res.status(400).send({ message: "Invalid code" });
            }

            const token = jwt.sign({ _id: user._id }, process.env.SECRET);
            return res.send({ accessToken: token });
        } catch (err) {
            return res.status(400).send({ message: err });
        }
    }
);

export default router;