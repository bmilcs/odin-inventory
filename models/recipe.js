const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  ingredients: [
    {
      ingredient: {
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
      },
      measurement: {
        type: String,
        required: true,
      },
    },
  ],
  instructions: [{ step: Number, description: String }],
  time: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
