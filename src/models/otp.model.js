import mongoose from "../../recources/database/mongoose.js";

const Otp = mongoose.model(
  'Otp',
  {
    code: {
      type: String,
      required: true,
      validate: {
        validator: (code) => { return /^([0-9]{4}$)/.test(code) },
        message: 'Otp should contain 4 symbols'
      }
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (phone) => { return /^([0-9]{11}$)/.test(phone) },
        message: 'Phone number should contain 11 symbols'
      }
    },
    expirationDate: {
      type: Date,
      default: () => { return new Date(Date.now() + (60 * 10 * 1000)) }
    },
  },
  'otps'
);

export { Otp };