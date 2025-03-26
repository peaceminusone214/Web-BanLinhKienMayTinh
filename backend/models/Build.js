const mongoose = require("mongoose");

const BuildSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  components: {
    cpu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    gpu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ram: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    motherboard: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    storage: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    psu: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    case: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    cooling_solution: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  total_price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Build", BuildSchema);
