const express = require("express");
const Build = require("../models/Build");
const Product = require("../models/Product");
const router = express.Router();

// Route lưu cấu hình
router.post("/add-build", async (req, res) => {
  try {
    const user_id = req.session.user?.userId;
    const { name, description, components, total_price } = req.body;

    // Kiểm tra xem các trường bắt buộc có được cung cấp không
    if (!name || !description || !components || !total_price) {
      return res.status(400).json({ error: "Thiếu thông tin cần thiết!" });
    }

    // Tạo mới Build với thông tin nhận được
    const newBuild = new Build({
      name,
      description,
      components,
      total_price,
      user_id: user_id || null, // user_id chỉ được thêm nếu có
    });

    // Lưu cấu hình
    await newBuild.save();
    res.status(201).json({
      message: "Cấu hình đã được thêm thành công!",
    });
  } catch (err) {
    console.error("Lỗi khi lưu cấu hình:", err);
    res.status(500).json({ error: "Không thể lưu cấu hình." });
  }
});

// Route lấy danh sách cấu hình
router.get("/get-builds", async (req, res) => {
  try {
    const { user_id } = req.query;
    let filter = { status: { $ne: "Deleted" } };

    if (user_id) {
      filter.user_id = user_id;
    }

    const builds = await Build.find(filter).lean(); // Dùng lean để thao tác object dễ hơn
    if (!builds.length) {
      return res.status(404).json({ message: "Không tìm thấy cấu hình nào" });
    }

    // Lấy danh sách tất cả _id sản phẩm có trong components
    const allComponentIds = builds
      .flatMap((build) => build.components.map((c) => c._id))
      .filter(Boolean);

    const products = await Product.find({ _id: { $in: allComponentIds } })
      .select("product_name price")
      .lean();

    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    const formattedBuilds = builds.map((build) => ({
      _id: build._id,
      name: build.name,
      components: build.components
        .map((comp) => {
          const product = productMap[comp._id.toString()];
          return product
            ? {
                _id: product._id,
                name: product.product_name,
                price: product.price,
                quantity: comp.quantity || 1,
              }
            : null;
        })
        .filter(Boolean),
    }));

    res.status(200).json(formattedBuilds);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách cấu hình" });
  }
});

// Route lấy danh sách cấu hình của user đang đăng nhập
router.get("/my-builds", async (req, res) => {
  try {
    const userId = req.session?.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    // Lấy tất cả builds của user hiện tại
    const builds = await Build.find({ user_id: userId, deleted: false })

    if (!builds.length) {
      return res.status(404).json({ message: "Không tìm thấy cấu hình nào của bạn" });
    }

    // Trả về tất cả dữ liệu của build và components mà không cần format
    res.status(200).json(builds);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách cấu hình cá nhân" });
  }
});

// Route xóa build (có thể xóa một hoặc nhiều build)
router.delete("/delete-builds", async (req, res) => {
  const { ids } = req.body;

  // Kiểm tra xem mảng IDs có hợp lệ không
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Mảng ID build không hợp lệ" });
  }

  try {
    // Đặt deleted: true cho nhiều build hoặc chỉ 1 build nếu mảng chỉ chứa 1 phần tử
    const updatedBuilds = await Build.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    // Nếu không có build nào được cập nhật
    if (updatedBuilds.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy build nào để xóa" });
    }

    // Trả về thông báo thành công
    res.status(200).json({
      message: `${updatedBuilds.modifiedCount} build đã được đánh dấu là đã xóa thành công`,
    });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi xóa build" });
  }
});

// Route cập nhật build
router.put("/update-build", async (req, res) => {
  try {
    const { _id, name, description, components, total_price } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Thiếu ID build" });
    }

    // Kiểm tra build có tồn tại không
    const existingBuild = await Build.findById(_id);
    if (!existingBuild) {
      return res.status(404).json({ message: "Build không tồn tại" });
    }

    // Cập nhật build
    existingBuild.name = name || existingBuild.name;
    existingBuild.description = description || existingBuild.description;
    
    // Cập nhật các thành phần (components) nếu có
    if (components) {
      existingBuild.components = components.map((component) => ({
        product_id: component.product_id || existingBuild.product_id,
        quantity: component.quantity || existingBuild.quantity,
      }));
    }

    existingBuild.total_price = total_price || existingBuild.total_price;

    await existingBuild.save();

    res.json({
      message: "Cập nhật build thành công",
      build: existingBuild,
    });
  } catch (error) {
    console.error("Lỗi cập nhật build:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật build" });
  }
});

module.exports = router;
