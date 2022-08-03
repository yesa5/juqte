import { Router } from "express";
import mongoose from "mongoose";

import authorized from "../middlewares/is.authorized.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js"

const router = Router();

router.get(
    "/",
    authorized,
    async (req, res) => {
        try {
            const owner = await User.findOne({ _id: req.userId });
            if (!owner) return res.status(400).send('User not found');

            const filters = {
                ownerRole: owner.role === 'driver' ? 'logistician' : 'driver',
                status: 'open',
            }       
            if (req.query.to) filters.to = req.query.to;
            if (req.query.weight) filters.weight = { $gte: req.query.weight };

            const orders = await Order.find(filters).limit(req.query.page * 5);

            return res.send({
                pagination: {
                    total: orders.length,
                    page: req.query.page,
                },
                data: orders,
            });
        } catch (err) {
            return res.status(500).send({ message: err });
        }
    }
);

router.get(
    "/archive",
    authorized,
    async (req, res) => {
        try {
            const owner = await User.findOne({ _id: req.userId });
            if (!owner) return res.status(400).send('User not found');

            const filters = {
                owner: owner._id,
            }  
            if (req.query.to) filters.to = req.query.to;
            if (req.query.weight) filters.weight = { $gte: req.query.weight };

            const orders = await Order.find(filters).limit(req.query.page * 5);

            return res.send({
                pagination: {
                    total: orders.length,
                    page: req.query.page,
                },
                data: orders,
            });
        } catch (err) {
            return res.status(500).send({ message: err });
        }
    }
);

router.post(
    "/",
    authorized,
    async (req, res) => {
        const orderData  = {
            status: "open",
            product: req.body.product,
            price: req.body.price, 
            weight: req.body.weight, 
            date: req.body.date, 
            type: req.body.type,
            from: req.body.from, 
            to: req.body.to,
            distance: req.body.distance,
        };
        try {
            const owner = await User.findOne({ _id: req.userId });
            if (!owner) {
                return res.status(400).send({ message: "User not found" });
            }

            orderData.owner = owner._id;
            orderData.ownerRole = owner.role;

            const order = new Order(orderData);
            await order.save();

            return res.send("Order created");
        } catch (err) {
            return res.status(400).send({ message: err });
        }
    }
);

router.put(
    "/:id",
    authorized,
    async (req, res) => {
        try {
            const order = await Order.findOne({ _id: req.params.id });
            if (!order) return res.status(400).send({ message: "Order not found" });
            if (order.owner.toString() !== req.userId) return res.status(403).send();

            const data = {
                product: req.body.product || order.product,
                price: req.body.price || order.price,
                weight: req.body.weight || order.weight,
                date: req.body.date || order.date,
                type: req.body.type || order.type,
                from: req.body.from || order.from,
                to: req.body.to || order.to,
                distance: req.body.distance || order.distance,
            };

            await order.updateOne(data);

            return res.send();
        } catch (err) {
            return res.status(500).send({ message: err });
        }
    }
);

export default router;