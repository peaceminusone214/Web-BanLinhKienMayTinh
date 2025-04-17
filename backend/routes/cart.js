const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Route đồng bộ giỏ hàng khi đăng nhập
router.post("/sync", async (req, res) => {
  try {
    const { user_id, cartItems, deliveryDate, deliveryTime, note } = req.body;

    if (!user_id || !cartItems) {
      return res.status(400).json({ message: "Thiếu user_id hoặc cartItems" });
    }

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      cart = new Cart({ user_id, items: [] });
    }

    cart.items = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));
    cart.note = note;
    cart.deliveryDate = deliveryDate || null;
    cart.deliveryTime = deliveryTime || null;

    await cart.save();
    res.status(200).json({ message: "Đồng bộ giỏ hàng thành công", cart });
  } catch (error) {
    console.error("Lỗi backend:", error); // Log lỗi vào console
    res
      .status(500)
      .json({ message: "Lỗi đồng bộ giỏ hàng", error: error.message });
  }
});

// Route lấy giỏ hàng của user
router.get("/get/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(200).json({ items: [] }); // Nếu không có giỏ hàng, trả về mảng rỗng
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error });
  }
});

module.exports = router;
