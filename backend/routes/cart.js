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

    // Cập nhật giỏ hàng với các item mới
    cartItems.forEach((newItem) => {
      const existingItem = cart.items.find((item) => item.product_id.toString() === newItem.id);

      if (existingItem) {
        // Nếu item đã tồn tại, chỉ cần cập nhật số lượng
        existingItem.quantity = newItem.quantity;
      } else {
        // Nếu item chưa tồn tại, thêm mới vào giỏ hàng
        cart.items.push({
          product_id: newItem.id,
          quantity: newItem.quantity,
          price: newItem.price,
        });
      }
    });

    // Cập nhật các thông tin khác
    cart.note = note;
    cart.deliveryDate = deliveryDate || null;
    cart.deliveryTime = deliveryTime || null;

    await cart.save();
    res.status(200).json({ message: "Đồng bộ giỏ hàng thành công", cart });
  } catch (error) {
    console.error("Lỗi backend:", error);
    res.status(500).json({ message: "Lỗi đồng bộ giỏ hàng", error: error.message });
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

// Route xóa giỏ hàng theo userId
router.delete("/clear-cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Xóa giỏ hàng theo user_id
    const result = await Cart.deleteOne({ user_id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng để xóa." });
    }

    res.status(200).json({ message: "Đã xóa giỏ hàng thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi xóa giỏ hàng", error: error.message });
  }
});

// Route xoá 1 sản phẩm trong giỏ hàng
router.delete('/remove-item', async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    const cart = await Cart.findOne({ user_id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
});

module.exports = router;
