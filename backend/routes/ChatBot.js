const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const DEFAULT_MODEL = process.env.DEFAULT_AI_MODEL || "meta-llama/llama-3-8b-instruct";

router.post("/", async (req, res) => {
  console.log("💬 Chat API called!");

  const { messages, model } = req.body;
  const selectedModel = model || DEFAULT_MODEL;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: selectedModel,
        messages: messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Bot trả lời:", response.data);
    res.json({ reply: response.data.choices[0].message });

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI call failed" });
  }
});

module.exports = router;

