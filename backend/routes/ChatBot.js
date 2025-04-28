const express = require("express");
const axios = require("axios");
require("dotenv").config();
const Product = require("../models/Product");
const Category = require("../models/Category");

const router = express.Router();
const DEFAULT_MODEL = process.env.DEFAULT_AI_MODEL || "deepseek/deepseek-chat-v3-0324:free";

const SYSTEM_PROMPT = {
  role: "system",
  content: `Bạn là trợ lý AI trên website bán linh kiện máy tính PCEcommerce.
  Nhiệm vụ của bạn là tư vấn, hỗ trợ và hướng dẫn người dùng chọn sản phẩm, cấu hình PC hoặc so sánh linh kiện.
  Hãy giao tiếp thân thiện, ngắn gọn và có gợi ý nếu cần. Nếu người dùng hỏi không rõ, hãy hỏi lại để hiểu rõ hơn.`
};

function extractIntent(message) {
  const text = message.toLowerCase();
  if (/cấu hình|build pc|tư vấn pc|xây dựng/i.test(text)) return "build";
  if (/so sánh|compare|khác gì|hơn/i.test(text)) return "compare";
  if (/còn hàng|giá bao nhiêu|mua|bán|có không|order/i.test(text)) return "product";
  if (/hello|hi|chào|xin chào|hướng dẫn|trợ giúp|bạn là ai/i.test(text)) return "greeting";
  return "general";
}

function detectBudget(text) {
  const match = text.match(/(\d+)(\s*)(triệu|tr|m|million|củ|triệu đồng)/i);
  return match ? parseInt(match[1]) * 1_000_000 : null;
}

async function fetchProducts(text) {
  const keyword = text.toLowerCase();
  const categories = await Category.find({});
  const matchCat = categories.find(c => keyword.includes(c.name.toLowerCase()));
  const products = await Product.find({
    deleted: false,
    ...(matchCat ? { category_id: matchCat._id } : {})
  }).limit(5);
  return products;
}

function formatProducts(products) {
  return products.map(p => `### ${p.product_name}\n💰 Giá: **${p.price.toLocaleString('vi-VN')} VND**\n📄 Mô tả: ${p.description?.slice(0, 100)}...\n---`).join("\n");
}

async function recommendBuild(budget, purpose) {
  try {
    budget = parseInt(budget);
    if (isNaN(budget)) return null;

    let componentBudgets = {};
    if (purpose.toLowerCase().includes('gaming')) {
      componentBudgets = {
        cpu: budget * 0.25,
        gpu: budget * 0.35,
        ram: budget * 0.1,
        motherboard: budget * 0.12,
        storage: budget * 0.08,
        psu: budget * 0.05,
        case: budget * 0.03,
        cooling: budget * 0.02
      };
    } else if (purpose.toLowerCase().includes('văn phòng') || purpose.toLowerCase().includes('office')) {
      componentBudgets = {
        cpu: budget * 0.3,
        gpu: budget * 0.15,
        ram: budget * 0.15,
        motherboard: budget * 0.15,
        storage: budget * 0.15,
        psu: budget * 0.05,
        case: budget * 0.03,
        cooling: budget * 0.02
      };
    } else {
      componentBudgets = {
        cpu: budget * 0.25,
        gpu: budget * 0.25,
        ram: budget * 0.12,
        motherboard: budget * 0.15,
        storage: budget * 0.1,
        psu: budget * 0.05,
        case: budget * 0.05,
        cooling: budget * 0.03
      };
    }

    const categories = await Category.find({}).select('_id name');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const build = {};
    const components = ['CPU', 'VGA', 'RAM', 'Mainboard', 'SSD', 'PSU', 'Case', 'Tản nhiệt khí'];
    const componentKeys = ['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case', 'cooling'];

    for (let i = 0; i < components.length; i++) {
      const categoryName = components[i];
      const budgetKey = componentKeys[i];
      if (!categoryMap[categoryName]) continue;

      const product = await Product.findOne({
        category_id: categoryMap[categoryName],
        price: { $lte: componentBudgets[budgetKey] },
        deleted: false,
        status: "In Stock"
      }).sort({ price: -1 }).limit(1);

      if (product) {
        build[budgetKey] = {
          id: product._id,
          name: product.product_name,
          price: product.price,
          brand: product.brand
        };
      }
    }

    let totalPrice = 0;
    Object.values(build).forEach(component => {
      totalPrice += component.price;
    });

    return {
      build,
      totalPrice,
      budgetRemaining: budget - totalPrice
    };
  } catch (error) {
    console.error("Error recommending build:", error);
    return null;
  }
}

router.post("/", async (req, res) => {
  const { messages } = req.body;
  const lastMessage = messages.filter(m => m.role === 'user').pop();
  const userText = lastMessage?.content || "";

  const intent = extractIntent(userText);
  const budget = detectBudget(userText);
  const enhancedMessages = messages.some(msg => msg.role === 'system')
    ? [...messages]
    : [SYSTEM_PROMPT, ...messages];

  try {
    if (intent === "greeting" && messages.length <= 2) {
      return res.json({ reply: { role: "assistant", content: "Xin chào 👋! Mình có thể giúp bạn tìm sản phẩm, build PC hoặc so sánh linh kiện nhé. Bạn đang quan tâm điều gì ạ?" }});
    }

    if (intent === "compare") {
      const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: DEFAULT_MODEL,
        messages: [...enhancedMessages, { role: "user", content: `Người dùng muốn so sánh: ${userText}. Truy vấn dữ liệu từ database sản phẩm nếu có để trả lời.` }],
        temperature: 0.7
      }, {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      });

      const aiContent = response.data?.choices?.[0]?.message?.content || "Tôi chưa rõ bạn muốn so sánh gì. Bạn có thể nói rõ hơn không?";
      return res.json({ reply: { role: "assistant", content: aiContent } });
    }

    if (intent === "general") {
      const products = await Product.find({ deleted: false, status: "In Stock" }).limit(5);
      const contextText = products.map(p =>
        `Tên: ${p.product_name}\nGiá: ${p.price.toLocaleString('vi-VN')} VND\nMô tả: ${p.description || 'Không có mô tả'}\n`
      ).join("\n");

      const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: DEFAULT_MODEL,
        messages: [
          SYSTEM_PROMPT,
          { role: "user", content: `Một số sản phẩm hiện có:\n\n${contextText}\n\nCâu hỏi của người dùng: ${userText}` }
        ],
        temperature: 0.7
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }        
      });

      const aiContent = response.data?.choices?.[0]?.message?.content || "Xin lỗi, mình chưa rõ ý bạn. Bạn có thể nói rõ hơn không ạ?";
      return res.json({ reply: { role: "assistant", content: aiContent } });
    }

    if (intent === "build") {
      if (budget) {
        const build = await recommendBuild(budget, userText);
        const content = `🛠️ **Cấu hình gợi ý cho ngân sách ~${budget.toLocaleString('vi-VN')} VND**\n\n` +
          Object.entries(build.build).map(([k, v]) => `- **${k.toUpperCase()}**: ${v.name} – ${v.price.toLocaleString('vi-VN')} VND`).join("\n") +
          `\n\n💸 **Tổng chi phí:** ${build.totalPrice.toLocaleString('vi-VN')} VND\n💰 **Còn dư:** ${build.budgetRemaining.toLocaleString('vi-VN')} VND\n\n---\n👉 Bạn muốn build để chơi game, làm việc hay đồ họa? Mình có thể tối ưu lại cấu hình cho đúng nhu cầu nhé!`;
        return res.json({ reply: { role: "assistant", content } });
      } else {
        return res.json({
          reply: {
            role: "assistant",
            content: "💡 Bạn muốn build PC với ngân sách khoảng bao nhiêu vậy ạ? Ví dụ: 'PC chơi game tầm 15 triệu' hoặc 'Build PC văn phòng 10tr'. Mình sẽ tư vấn chi tiết hơn nhé!"
          }
        });
      }
    }

    if (intent === "product") {
      const products = await fetchProducts(userText);
      if (!products.length) return res.json({ reply: { role: "assistant", content: "Mình chưa tìm thấy sản phẩm phù hợp 😢. Bạn có thể nói rõ hơn tên hoặc loại linh kiện không?" }});
      const content = `📦 **Một số sản phẩm phù hợp với bạn:**\n\n${formatProducts(products)}\n👉 Bạn muốn xem thêm sản phẩm khác hay cần mình tư vấn cụ thể hơn không? 😊`;
      return res.json({ reply: { role: "assistant", content } });
    }

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: DEFAULT_MODEL,
      messages: enhancedMessages,
      temperature: 0.6
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const aiContent = response.data?.choices?.[0]?.message?.content || "Xin lỗi, mình chưa rõ ý bạn. Bạn có thể nói rõ hơn không ạ?";
    res.json({ reply: { role: "assistant", content: aiContent } });

  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.json({ reply: { role: "assistant", content: "Xin lỗi, hiện mình đang gặp sự cố kỹ thuật. Bạn thử lại sau nhé!" }});
  }
});

module.exports = router;
