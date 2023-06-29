const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, maxLength: 1000 },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

CategorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
