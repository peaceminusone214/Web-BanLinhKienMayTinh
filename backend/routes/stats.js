const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
    try {
        // Get total revenue
        const orders = await Order.find({ payment_status: 'Paid' });
        console.log("Số đơn hàng đã thanh toán:", orders.length);
        
        // Log chi tiết để debug
        orders.forEach((order, index) => {
            console.log(`Đơn hàng ${index + 1}:`, {
                id: order._id,
                status: order.order_status,
                payment: order.payment_status,
                amount: order.total_amount
            });
        });
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        console.log("Tổng doanh thu:", totalRevenue);
        
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
            .limit(5)
            .populate('user_id', 'username email');
        
        // Get recent users
        const recentUsers = await User.find()
            .sort({ created_at: -1 })
            .limit(5)
            .select('username email created_at');
        
        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$order_status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get sales data by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const salesByMonth = await Order.aggregate([
            {
                $match: {
                    created_at: { $gte: sixMonthsAgo },
                    payment_status: 'Paid'
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" }
                    },
                    totalSales: { $sum: "$total_amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        
        // Get top selling products
        const topSellingProducts = await Order.aggregate([
            { 
                $match: { 
                    payment_status: 'Paid'
                } 
            },
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.product_id",
                    totalSold: { $sum: "$products.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $project: {
                    _id: 1,
                    name: "$productInfo.product_name",
                    price: "$productInfo.price",
                    totalSold: 1
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalUsers,
                totalComments,
                recentOrders,
                recentUsers,
                ordersByStatus,
                salesByMonth,
                topSellingProducts
            }
        });
        
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching statistics",
            error: error.message
        });
    }
});

module.exports = router; 