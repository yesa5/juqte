import mongoose from "../../recources/database/mongoose.js";

const Order = mongoose.model(
  'Order',
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ownerRole: {
      type: String,
      required: true,
      enum: ['logistician', 'driver'],
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'cancelled', 'inProgress', 'finished'],
    },
    product: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    weight: {
        type: Number,
        required: true,
        min: 1,
        max: 20000,
    },
    date: {
        type: Date,
        required: true,
        min: Date.now(),
    },
    type: {
        type: String,
        required: true,
        enum: ['test'],
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  'orders',
);

export { Order };