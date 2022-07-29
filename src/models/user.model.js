import mongoose from "../../recources/database/mongoose.js";

const User = mongoose.model(
  'User',
  {
    iin: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (iin) => { return /^([0-9]{12}$)/.test(iin) },
        message: 'IIN should contain 12 symbols'
      }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (phone) => { return /^([0-9]{11}$)/.test(phone) },
          message: 'Phone number should contain 11 symbols'
        }
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    role: {
      type: String,
      enum: ['logistician', 'driver'],
      required: true,
    },
    activated: {
      type: Boolean,
      default: false,
    },
  },
  'users'
);

export { User };