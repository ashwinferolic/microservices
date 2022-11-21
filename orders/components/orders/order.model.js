const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: Object,
    },
    products: {
      type: Array,
    },
    orderedDate: {
      type: Date,
    },
    orderType: {
      type: String,
    },
    status: {
      type: String,
    },
    newUser: {
      type: Boolean,
      default: true,
    },
    prescription: {
      doctorName: {
        type: String,
      },
      patientName: {
        type: String,
      },
      refillDays: {
        type: Number,
      },
      reviewed: {
        type: Boolean,
        default: false,
      },
      images: {
        type: Array,
      },
    },
    payment: {
      type: {
        type: String,
      },
      cartValue: {
        type: Number,
      },
      deliveryCharge: {
        type: Number,
      },
      total: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
