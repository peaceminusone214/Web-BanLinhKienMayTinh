const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const router = express.Router();



// Route thêm danh mục sản phẩm
router.post("/add-category", async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Tên và mô tả danh mục là bắt buộc!" });
  }

  try {
    const newCategory = new Category({
      name,
      description,
    });

    // Lưu danh mục vào cơ sở dữ liệu
    await newCategory.save();

    res.status(201).json({ message: "Danh mục đã được thêm thành công!" });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// Route lấy danh sách tên của danh mục sản phẩm
router.get("/categories", async (req, res) => {
  try {
    // Lấy chỉ trường 'name' của tất cả các danh mục từ cơ sở dữ liệu
    const categories = await Category.find().select("name");

    // Kiểm tra nếu không có danh mục nào
    if (categories.length === 0) {
      return res.status(404).json({ message: "Không có danh mục nào!" });
    }

    // Trả về danh sách tên các danh mục
    res.status(200).json(categories);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});




router.get("/category-by-name/:name", async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Lỗi" });
  }
});


//Route thêm sản phẩm(có thể thêm nhiều hơn 1 sp)
router.post("/add-product", async (req, res) => {
  let products = req.body;

  if (!Array.isArray(products)) {
    products = [products];
  }

  if (products.length === 0) {
    return res.status(400).json({ message: "Dữ liệu sản phẩm không hợp lệ" });
  }

  let errorMessages = []; // Mảng chứa lỗi

  try {
    for (let i = 0; i < products.length; i++) {
      const {
        product_name,
        description,
        category_id,
        price,
        stock_quantity,
        image_url,
        brand,
        condition,
        specifications,
        warranty,
        compatibility,
      } = products[i];

      let missingFields = []; // Mảng chứa trường bị thiếu

      // Kiểm tra các trường bắt buộc chung
      if (!product_name) missingFields.push("product_name");
      if (!description) missingFields.push("description");
      if (!category_id) missingFields.push("category_id");
      if (!price) missingFields.push("price");
      if (!stock_quantity) missingFields.push("stock_quantity");
      if (!image_url) missingFields.push("image_url");
      if (!brand) missingFields.push("brand");
      if (!condition) missingFields.push("condition");

      // Kiểm tra danh mục hợp lệ
      const category = await Category.findById(category_id);
      if (!category) {
        missingFields.push("category_id (Không hợp lệ)");
      }

      // Kiểm tra xem sản phẩm đã tồn tại chưa
      const existingProduct = await Product.findOne({ product_name });
      if (existingProduct) {
        errorMessages.push(`Sản phẩm "${product_name}" đã tồn tại`);
      }

      // Kiểm tra các trường yêu cầu theo danh mục sản phẩm
      const requiredCategoriesWithSpecifications = [
        "CPU",
        "Mainboard",
        "RAM",
        "SSD",
        "HDD",
        "VGA",
        "PSU",
        "Tản nhiệt khí",
        "Tản nhiệt AIO",
      ];
      const requiredCategoriesWithWarranty = [
        "CPU",
        "Mainboard",
        "RAM",
        "VGA",
        "SSD",
        "HDD",
      ];
      const requiredCategoriesWithCompatibility = [
        "CPU",
        "Mainboard",
        "VGA",
        "RAM",
        "PSU",
        "Case",
        "Tản nhiệt khí",
        "Tản nhiệt AIO",
      ];

      if (
        requiredCategoriesWithSpecifications.includes(category?.name) &&
        !specifications
      ) {
        missingFields.push("specifications");
      }
      if (
        requiredCategoriesWithWarranty.includes(category?.name) &&
        !warranty
      ) {
        missingFields.push("warranty");
      }
      if (
        requiredCategoriesWithCompatibility.includes(category?.name) &&
        !compatibility
      ) {
        missingFields.push("compatibility");
      }

      // Nếu có lỗi, thêm vào danh sách lỗi
      if (missingFields.length > 0) {
        errorMessages.push(
          `Sản phẩm thứ ${i + 1} thiếu các trường: ${missingFields.join(", ")}`
        );
      }
    }

    // Nếu có lỗi, trả về danh sách lỗi
    if (errorMessages.length > 0) {
      return res
        .status(400)
        .json({ message: "Lỗi khi thêm sản phẩm", errors: errorMessages });
    }

    // Nếu không có lỗi, tiến hành thêm sản phẩm
    for (let i = 0; i < products.length; i++) {
      const newProduct = new Product({
        ...products[i],
        updated_at: Date.now(),
      });

      await newProduct.save();
    }

    res
      .status(201)
      .json({ message: "Tất cả sản phẩm đã được thêm thành công!" });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi thêm sản phẩm" });
  }
});

// Route lấy danh sách sản phẩm
router.get("/get-products", async (req, res) => {
  try {
    const { category_id } = req.query; // Lấy `category_id` từ query params
    let filter = {};

    if (category_id) {
      filter.category_id = category_id; // Nếu có category_id, lọc theo danh mục
    }

    const products = await Product.find(filter)
      .populate("category_id", "name") // Populate để lấy tên danh mục
      .exec();

    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm" });
  }
});

// Route lấy danh sách sản phẩm (chỉ lấy _id và product_name)
router.get("/get-product-names", async (req, res) => {
  try {
    const { category_id } = req.query;
    let filter = {};

    if (category_id) {
      filter.category_id = category_id; // Lọc theo danh mục nếu có
    }

    const products = await Product.find(filter)
      .select("_id product_name") // Chỉ lấy _id và product_name
      .exec();

    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách sản phẩm" });
  }
});

// Route lấy _id của danh mục theo tên
router.post("/get-category-id", async (req, res) => {
  try {
    const { name } = req.body; // Lấy tên danh mục từ body request

    // Kiểm tra xem tên danh mục có được cung cấp không
    if (!name) {
      return res
        .status(400)
        .json({ message: "Tên danh mục không được cung cấp" });
    }

    // Tìm kiếm danh mục theo tên
    const category = await Category.findOne({ name: name });

    // Kiểm tra nếu không tìm thấy danh mục
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Trả về _id của danh mục
    res.status(200).json({ categoryId: category._id });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy _id danh mục" });
  }
});

//Route lấy thông tin danh mục
router.post("/get-category", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID danh mục là bắt buộc!" });
  }

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại!" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// Route lấy danh sách thương hiệu (brand)
router.get("/get-brands", async (req, res) => {
  try {
    // Lấy danh sách các thương hiệu từ các sản phẩm
    const brands = await Product.distinct("brand");

    // Kiểm tra nếu không có thương hiệu nào
    if (brands.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thương hiệu nào" });
    }

    // Trả về danh sách thương hiệu
    res.status(200).json(brands);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy thương hiệu" });
  }
});

// Route lấy danh sách thương hiệu (brand) theo danh mục
router.get("/get-brands-category", async (req, res) => {
  try {
    const { category_id } = req.query;

    // Nếu có category_id, chỉ lấy thương hiệu của danh mục đó
    let query = {};
    if (category_id) {
      query = { category_id };
    }

    // Lấy danh sách các thương hiệu từ các sản phẩm theo danh mục (nếu có)
    const brands = await Product.distinct("brand", query);

    if (brands.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy thương hiệu nào" });
    }

    res.status(200).json(brands);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy thương hiệu" });
  }
});

// Route lấy danh sách các trường của Specification
router.get("/get-specifications", async (req, res) => {
  try {
    // Tìm tất cả các sản phẩm và lấy trường specifications
    const products = await Product.find()
      .select("specifications") // Chỉ lấy trường specifications
      .exec();

    // Kiểm tra nếu không có sản phẩm nào
    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" });
    }

    // Dùng Set để lưu trữ các trường duy nhất
    const fields = new Set();

    // Duyệt qua tất cả các sản phẩm và thêm các trường vào Set
    products.forEach((product) => {
      if (product.specifications) {
        // Kiểm tra nếu specifications tồn tại
        Object.keys(product.specifications).forEach((field) => {
          fields.add(field); // Thêm trường vào Set
        });
      }
    });

    // Chuyển Set thành mảng và trả về
    const uniqueFields = Array.from(fields);

    // Trả về các trường duy nhất
    res.status(200).json(uniqueFields);
  } catch (err) {
    console.error("Lỗi khi lấy specifications:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy specifications" });
  }
});

// Route lấy danh sách các Specification và giá trị của nó
router.get("/get-specificationvalues", async (req, res) => {
  try {
    // Lấy tất cả sản phẩm và chỉ trả về field 'specifications'
    const products = await Product.find({}, "specifications").populate(
      "category_id",
      "name"
    ); // Nếu muốn populate tên danh mục sản phẩm (tuỳ chọn)

    // Trả về danh sách specifications của tất cả sản phẩm
    const allSpecifications = products.map((product) => product.specifications);

    return res.status(200).json(allSpecifications); // Trả về trực tiếp danh sách specifications
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy specifications.",
    });
  }
});

// Route lấy danh sách các trường của Compatibility
router.get("/get-compatibilities", async (req, res) => {
  try {
    // Tìm tất cả các sản phẩm và chỉ lấy trường compatibility
    const products = await Product.find().select("compatibility").exec();

    // Kiểm tra nếu không có sản phẩm nào
    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" });
    }

    // Dùng Set để lưu trữ các trường duy nhất
    const fields = new Set();

    // Duyệt qua tất cả các sản phẩm
    products.forEach((product) => {
      if (product.compatibility) {
        // Kiểm tra nếu compatibility tồn tại
        Object.keys(product.compatibility).forEach((field) => {
          fields.add(field); // Thêm trường vào Set
        });
      }
    });

    // Chuyển Set thành mảng và trả về
    const uniqueFields = Array.from(fields);

    // Trả về danh sách các trường duy nhất của compatibility
    res.status(200).json(uniqueFields);
  } catch (err) {
    console.error("Lỗi khi lấy compatibility:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy compatibility" });
  }
});

// Route lấy danh sách các Compatibility và giá trị của nó
router.get("/get-compatibilityvalues", async (req, res) => {
  try {
    // Lấy tất cả sản phẩm và chỉ trả về field 'compatibility'
    const products = await Product.find({}, "compatibility").populate(
      "category_id",
      "name"
    ); // Nếu muốn populate tên danh mục sản phẩm (tuỳ chọn)

    // Lọc ra tất cả các compatibility từ danh sách sản phẩm
    const allCompatibility = products
      .filter((product) => product.compatibility) // Loại bỏ sản phẩm không có compatibility
      .map((product) => product.compatibility); // Lấy compatibility của từng sản phẩm

    return res.status(200).json(allCompatibility); // Trả về danh sách compatibility
  } catch (error) {
    console.error("Lỗi khi lấy compatibility:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy compatibility.",
    });
  }
});

// Route xóa sản phẩm (có thể xóa một hoặc nhiều sản phẩm)
router.delete("/delete-products", async (req, res) => {
  const { ids } = req.body;

  // Kiểm tra xem mảng IDs có hợp lệ không
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Mảng ID sản phẩm không hợp lệ" });
  }

  try {
    // Xóa nhiều sản phẩm hoặc chỉ 1 sản phẩm nếu mảng chỉ chứa 1 phần tử
    const deletedProducts = await Product.deleteMany({ _id: { $in: ids } });

    // Nếu không có sản phẩm nào bị xóa
    if (deletedProducts.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm nào để xóa" });
    }

    // Trả về thông báo thành công
    res
      .status(200)
      .json({
        message: `${deletedProducts.deletedCount} sản phẩm đã được xóa thành công`,
      });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi xóa sản phẩm" });
  }
});




// =============================================================================================
// Get Product by ID category
router.get("/products-by-category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category_id: categoryId })
      .populate("category_id", "name")
      .exec();

    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào trong danh mục này" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// get All category
router.get("/get-all-categories", async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "Không có danh mục nào!" });
    }

    res.status(200).json(categories);
  } catch (err) {
    console.error("Lỗi khi lấy danh mục:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});




// get category by ID
router.get("/get-category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error("Lỗi khi lấy danh mục:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});




// get all sub by category ID
router.get("/sub-slugs/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    if (!category.subCategories || category.subCategories.length === 0) {
      return res.status(404).json({ message: "Danh mục không có subCategories" });
    }

    const result = category.subCategories.map((sub) => ({
      name: sub.name,
      slug: sub.slug,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi khi lấy subCategories:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});



router.get("/get-slug/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  console.log("Nhận được ID:", categoryId);

  try {
    const category = await Category.findById(categoryId).select("slug");
    console.log("Kết quả truy vấn:", category);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    res.status(200).json({ slug: category.slug });
  } catch (err) {
    console.error("Lỗi khi lấy slug:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});


// get category by slug
router.get("/get-category-by-slug/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const category = await Category.findOne({ slug: slug });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    const products = await Product.find({ category_id: category._id });

    res.status(200).json({
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
      },
      products: products,
    });
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm theo slug:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});







//get all product
router.get("/get-all-products", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category_id", "name")
      .exec();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Lỗi khi lấy tất cả sản phẩm:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});



// product filter
router.get("/products-filter", async (req, res) => {
  try {
    const { price, category, brand, sort, name } = req.query;
    let filter = {};

    // Lọc theo giá
    if (price) {
      const priceRange = price.split('-');
      if (priceRange.length === 1) {
        filter.price = { $lt: Number(priceRange[0]) };
      } else if (priceRange.length === 2) {
        filter.price = { $gte: Number(priceRange[0]), $lte: Number(priceRange[1]) };
      }
    }

    // Lọc theo category
    if (category) {
      const categoryData = await Category.findOne({ slug: category });
      if (categoryData) {
        filter.category_id = categoryData._id; 
      }
    }

    if (brand) {
      filter.brand = brand;
    }

    if (name) {
      filter.product_name = { $regex: name, $options: 'i' }; 
    }

    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'new':
          sortOption.created_at = -1;
          break;
        case 'price-asc':
          sortOption.price = 1;
          break;
        case 'price-desc':
          sortOption.price = -1;
          break;
        default:
          break;
      }
    }

    // Tìm các sản phẩm theo filter và sort
    const products = await Product.find(filter)
      .populate('category_id', 'name')
      .sort(sortOption)
      .exec();

    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm nào' });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error('Lỗi khi lấy sản phẩm:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy sản phẩm' });
  }
});


router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    const searchRegex = new RegExp("^" + q, "i");

    const matchedCategories = await Category.find({ name: searchRegex }).select("_id");

    const categoryIds = matchedCategories.map((cat) => cat._id);

    const products = await Product.find({
      $or: [
        { product_name: searchRegex },
        { category_id: { $in: categoryIds } },
      ],
    }).populate("category_id", "name");

    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});


router.post("/compare", async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const products = await Product.find({ _id: { $in: productIds } })
      .populate("category_id", "name")
      .exec();

    res.status(200).json(products);
  } catch (err) {
    console.error("Lỗi khi so sánh sản phẩm:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});




// ==============================================================================================












// Route lấy thông tin sản phẩm theo id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route cập nhật sản phẩm
router.put("/update-product", async (req, res) => {
  try {
    const { _id, product_name, category_id, stock_quantity, price } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Thiếu ID sản phẩm" });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const existingProduct = await Product.findById(_id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Cập nhật sản phẩm
    existingProduct.product_name = product_name || existingProduct.product_name;
    existingProduct.category_id = category_id || existingProduct.category_id;
    existingProduct.stock_quantity =
      stock_quantity || existingProduct.stock_quantity;
    existingProduct.price = price || existingProduct.price;

    await existingProduct.save();

    res.json({
      message: "Cập nhật sản phẩm thành công",
      product: existingProduct,
    });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật sản phẩm" });
  }
});




module.exports = router;
