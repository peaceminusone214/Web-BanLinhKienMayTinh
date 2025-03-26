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

// Lấy vai trò người dùng từ Casbin
const getRolesForUsername = async (username) => {
  if (!enforcer) {
    throw new Error("Casbin enforcer chưa được khởi tạo");
  }
  const roles = await enforcer.getRolesForUser(username);
  return roles.length > 0 ? roles : ["customer"];
};

// Middleware phân quyền bằng Casbin
const casbinMiddleware = async (req, res, next) => {
  if (!enforcer) {
    console.error("Casbin Enforcer chưa được khởi tạo");
    return res.status(500).send("Casbin Enforcer chưa được khởi tạo");
  }

  const { roles } = req.user;
  const object = req.originalUrl;
  const action = req.method.toLowerCase();

  console.log("Kiểm tra quyền:", roles, object, action);

  try {
    const allowed = await enforcer.enforce(roles, object, action);

    if (allowed) {
      console.log("Truy cập được phép");
      next();
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
  getRolesForUsername,
};
