const mongoose = require("mongoose");
const News = require("./models/News"); // Import model
require("dotenv").config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const newsData = [
  {
    title: "NVIDIA công bố GeForce RTX 5090 với hiệu suất đột phá",
    content: "NVIDIA vừa tiết lộ thế hệ card đồ họa mới nhất với những cải tiến mạnh mẽ...",
    category: "TIN CÔNG NGHỆ",
    image: "/assets/interface-main/imgNews/rtx5090.png",
    author: "Tech Reviewer",
    views: 320,
    comments: 2,
  },
  {
    title: "PS6 sẽ ra mắt vào năm 2028?",
    content: "Theo một số nguồn tin rò rỉ, Sony đang có kế hoạch phát triển hệ máy chơi game mới...",
    category: "GAME",
    image: "/assets/interface-main/imgNews/ps6.png",
    author: "Gaming News",
    views: 512,
    comments: 10,
  },
  {
    title: "Intel ra mắt CPU thế hệ 15 Meteor Lake",
    content: "Intel chính thức công bố dòng vi xử lý mới với hiệu suất tối ưu và tiêu thụ điện năng thấp...",
    category: "TIN CÔNG NGHỆ",
    image: "/assets/interface-main/imgNews/intel15.png",
    author: "Admin",
    views: 210,
    comments: 4,
  },
  {
    title: "GTA 6 chính thức xác nhận ngày phát hành",
    content: "Rockstar Games vừa đưa ra thông báo chính thức về ngày phát hành của GTA 6...",
    category: "GAME",
    image: "/assets/interface-main/imgNews/gta6.png",
    author: "GameSpot",
    views: 920,
    comments: 15,
  },
];

// Hàm seed dữ liệu
const seedDB = async () => {
  try {
    await News.insertMany(newsData);
    console.log("Nhập dữ liệu thành công!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Lỗi khi nhập dữ liệu:", error);
    mongoose.connection.close();
  }
};

// Chạy seed dữ liệu
seedDB();
