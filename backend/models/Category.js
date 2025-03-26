const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
  },
  subCategories: [
    {
      name: { type: String, required: true },
      slug: { type: String, required: true },
    }
  ],
});

module.exports = mongoose.model("Category", CategorySchema);
