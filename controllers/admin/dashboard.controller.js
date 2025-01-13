const Account = require('../../models/account.model')
const Order = require('../../models/order.model');     
const Coupon = require('../../models/coupon.model');   
const User = require('../../models/user.model');
const ProductCategory = require('../../models/products-category.model');
const Product = require('../../models/product.model')


module.exports.index = async (req, res) => {
  try {
    // Thống kê tài khoản
    const totalAccounts = await Account.countDocuments({ deleted: false });
    const activeAccounts = await Account.countDocuments({ status: 'active' });
    const inactiveAccounts = await Account.countDocuments({ status: 'inactive' });

    // Thống kê người dùng
    const totalUsers = await User.countDocuments({ deleted: false });
    const femaleUsers = await User.countDocuments({ gender: 'Female', deleted: false });
    const maleUsers = await User.countDocuments({ gender: 'Male', deleted: false });
    const otherGenderUsers = await User.countDocuments({ gender: 'Other', deleted: false });

    // Thống kê danh mục sản phẩm
    const totalCategories = await ProductCategory.countDocuments({ deleted: false });
    const activeCategories = await ProductCategory.countDocuments({ status: 'active' });
    const featuredCategories = await ProductCategory.countDocuments({ isFeatured: true });

    // Thống kê đơn hàng
    const totalOrders = await Order.countDocuments({ deleted: false });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Thống kê sản phẩm
    const totalProducts = await Product.countDocuments({ status: "active" });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const bestSellerProducts = await Product.countDocuments({ isBestSeller: true });
    const inactiveProducts = await Product.countDocuments({ status: "inactive" });

    // Tổng doanh thu từ tất cả các đơn hàng đã hoàn thành
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;

    res.render('admin/pages/dashboard/index', {
      title: 'Shop của tôi',
      message: 'Welcome to the admin dashboard!',
      titleTopbar: "WELCOME!",
      stats: {
        totalAccounts,
        activeAccounts,
        inactiveAccounts,
        totalUsers,
        femaleUsers,
        maleUsers,
        otherGenderUsers,
        totalCategories,
        activeCategories,
        featuredCategories,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalProducts,
        featuredProducts,
        bestSellerProducts,
        inactiveProducts,
        revenue,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.redirect("back");
  }
};







  