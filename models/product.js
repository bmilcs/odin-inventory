const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 300,
  },
  description: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.virtual("url").get(function () {
  return `/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
