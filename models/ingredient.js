const mongoose = require("mongoose");

const { Schema } = mongoose;

const IngredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Ingredient = mongoose.model("Ingredient", IngredientSchema);
