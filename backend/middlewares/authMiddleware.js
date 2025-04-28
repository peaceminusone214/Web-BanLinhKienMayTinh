const { newEnforcer } = require("casbin");
const path = require("path");

let enforcer;

// Khởi tạo Casbin
const initializeCasbin = async () => {
  if (!enforcer) {
    enforcer = await newEnforcer(
      path.resolve(__dirname, "../Casbin/model.conf"),
      path.resolve(__dirname, "../Casbin/policy.csv")
    );
  }
  console.log("Casbin Enforcer đã được khởi tạo");
};

// Middleware phân quyền bằng Casbin
const casbinMiddleware = async (req, res, next) => {
  if (!enforcer) {
    console.error("Casbin Enforcer chưa được khởi tạo");
    return res.status(500).send("Casbin Enforcer chưa được khởi tạo");
  }

  if (!req.user || !req.user.roles || req.user.roles.length === 0) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập hoặc không có vai trò" });
  }

  const roles = req.user.roles; // Lấy roles từ session của người dùng
  const object = req.originalUrl.split("?")[0]; // Lấy URL không có query string
  const action = req.method.toLowerCase(); // Phương thức HTTP (GET, POST, PUT, DELETE)

  console.log("Kiểm tra quyền:", roles, object, action);

  try {
    let allowed = false;

    // Kiểm tra quyền cho từng role trong danh sách roles của người dùng
    for (const role of roles) {
      const result = await enforcer.enforce(role, object, action);
      if (result) {
        allowed = true;
        break;
      }
    }

    if (allowed) {
      console.log("Truy cập được phép");
      next(); // Cho phép truy cập
    } else {
      console.log("Truy cập bị từ chối");
      res.status(403).send("Truy cập bị từ chối");
    }
  } catch (err) {
    console.error("Lỗi khi kiểm tra Casbin:", err);
    res.status(500).send("Lỗi máy chủ khi kiểm tra quyền truy cập");
  }
};

module.exports = {
  casbinMiddleware,
  initializeCasbin,
};
