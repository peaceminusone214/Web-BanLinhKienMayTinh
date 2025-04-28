const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const buildRoutes = require("./routes/build");
const discountRoutes = require("./routes/discount");
const cartRoutes = require("./routes/cart");
const newsRoutes = require("./routes/news");
const paymentRoutes = require('./routes/payment');
const commentRoutes = require('./routes/comment');
const chatRoutes = require("./routes/chatbot");
const statsRoutes = require('./routes/stats');
const momoRoutes = require("./routes/momo");
const messageRoutes = require("./routes/message");
const authSessionMiddleware = require("./middlewares/authSessionMiddleware");
const { initializeCasbin } = require("./middlewares/authMiddleware");

const app = express();
require("dotenv").config();

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

app.set("trust proxy", 1); // cần thiết cho production

// Cấu hình session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 giờ
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.COOKIE_SAMESITE, //Để Lax nếu muốn chạy ở local, ngược lại None
    },
  })
);

// Gán session.user → req.user
app.use(authSessionMiddleware);

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/build", buildRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/news", newsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/comment', commentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/chat", chatRoutes);
app.use('/api/stats', statsRoutes);
app.use("/api/momo", momoRoutes);
app.use("/api/message", messageRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;

(async () => {
  await initializeCasbin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

