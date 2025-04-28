const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Post /api/messages/send (user/admin)
router.post('/send', async (req, res) => {
    try {
        const { sessionId, role, content } = req.body;

        if (!sessionId || !role || !content) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Validate role
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ error: 'Invalid role.' });
        }

        const message = new Message({
            sessionId,
            role,
            content,
            isFromBot: false,
            modelUsed: null
        });

        await message.save();

        res.status(201).json({ message: 'Message sent successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });


    }
});

module.exports = router;

//Post / api/messages/bot-reply
router.post('/bot-reply', async (req, res) => {
    try {
        const { sessionId, content, modelUsed } = req.body;

        if (!sessionId || !content) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const message = new Message({
            sessionId,
            role: "assistant",
            content,
            isFromBot: true,
            modelUsed: modelUsed || null
        });

        await message.save();

        res.status(201).json({ message: 'Bot reply saved successfully.' });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
})

//Get /api/messages/history?sessionId=abc&limit=20&skip=0
router.get('/history', async (req, res) => {
    try {
        const { sessionId, limit = 1000, skip = 0 } = req.query;

        if (!sessionId) {
            return res.status(400).json({ error: 'sessionId is required.' });
        }

        const messages = await Message.find({ sessionId })
            .sort({ createdAt: 1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        res.json(messages);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
})

// GET /api/messages/sessions
router.get('/sessions', async (req, res) => {
    try {
      const sessions = await Message.aggregate([
        {
          $group: {
            _id: "$sessionId",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            sessionId: "$_id",
            count: 1
          }
        }
      ]);
      res.json(sessions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  router.get('/all-messages', async (req, res) => {
    try {
      const messages = await Message.find({});
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error.' });
    }
  });
  