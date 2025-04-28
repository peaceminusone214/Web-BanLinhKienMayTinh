const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Comment = require("../models/Comment");

//
router.get("/dashboard", async (req, res) => {
  try {
    // Get total revenue
    const orders = await Order.find({ payment_status: "Paid" });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    );

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total comments count
    const totalComments = await Comment.countDocuments();

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ created_at: -1 })
      .limit(10) // Increased to show more recent orders
      .populate({
        path: "user_id",
        select: "username email",
        match: { user_id: { $exists: true } } // Đảm bảo user_id tồn tại
      });

    // Kiểm tra và gán giá trị mặc định cho các đơn hàng không có user_id
    const recentOrdersWithFallback = recentOrders.map(order => {
      if (!order.user_id) {
        order.user_id = {
          username: "Anonymous",
          email: "N/A"
        };
      }
      return order;
    });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ created_at: -1 })
      .limit(5)
      .select("username email created_at");

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$order_status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get sales data by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const salesByMonth = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: sixMonthsAgo },
          payment_status: "Paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" },
          },
          totalSales: { $sum: "$total_amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Get revenue by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueByDay = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: thirtyDaysAgo },
          payment_status: "Paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" },
            day: { $dayOfMonth: "$created_at" },
          },
          totalSales: { $sum: "$total_amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    // Get revenue by week (last 12 weeks)
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks * 7 days

    const revenueByWeek = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: twelveWeeksAgo },
          payment_status: "Paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            week: { $week: "$created_at" },
          },
          totalSales: { $sum: "$total_amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
    ]);

    // Get revenue by quarter (last 4 quarters)
    const fourQuartersAgo = new Date();
    fourQuartersAgo.setMonth(fourQuartersAgo.getMonth() - 12); // 4 quarters * 3 months

    const revenueByQuarter = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: fourQuartersAgo },
          payment_status: "Paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            quarter: { 
              $ceil: { $divide: [{ $month: "$created_at" }, 3] } 
            },
          },
          totalSales: { $sum: "$total_amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.quarter": 1 },
      },
    ]);

    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product_id",
          totalSold: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 1,
          name: "$productInfo.product_name",
          price: "$productInfo.price",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        totalComments,
        recentOrders: recentOrdersWithFallback, // Trả về đơn hàng đã xử lý
        recentUsers,
        ordersByStatus,
        salesByMonth,
        topSellingProducts,
        revenueByDay,
        revenueByWeek,
        revenueByQuarter
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
});

module.exports = router;
