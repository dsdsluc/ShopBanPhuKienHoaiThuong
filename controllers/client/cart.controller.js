const Cart = require("../../models/cart.model");
const Coupon = require("../../models/coupon.model");
const Order = require("../../models/order.model");
const emailHelper = require("../../helpers/sendMail");

module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    // Tìm giỏ hàng và deep populate thông tin sản phẩm + categories
    const cart = await Cart.findById(cartId)
      .populate({
        path: "products.product_id",
        populate: {
          path: "product_category_id", // Populate category của sản phẩm
          select: "title", // Chỉ lấy trường `title` của category
        },
      });

    if (!cart) {
      req.flash("error", "Không tìm thấy giỏ hàng.");
      return res.redirect("back");
    }

    // Tính toán chi tiết giỏ hàng
    const items = cart.products
      .map((item) => {
        const product = item.product_id;
        if (!product) return null; 

        const discountAmount = Math.round((product.price * product.discountPercentage) / 100);
        const finalPrice = Math.round(product.price - discountAmount);

        return {
          product: {
            id: product._id,
            size: product.size,
            name: product.title,
            price: Math.round(product.price),
            discountPercentage: Math.round(product.discountPercentage),
            finalPrice,
            image: product.thumbnail?.[0],
            category: product.product_category_id?.title || "Không rõ danh mục", 
            rating: product.rating
          },
          quantity: Math.round(item.quantity),
          totalPrice: Math.round(finalPrice * item.quantity),
          size: item.size
        };
      })
      .filter((item) => item !== null);

    const totalQuantity = Math.round(items.reduce((sum, item) => sum + item.quantity, 0));
    const totalPrice = Math.round(items.reduce((sum, item) => sum + item.totalPrice, 0));

    res.render("clients/pages/cart/index", {
      title: "Giỏ hàng",
      cart: {
        items,
        totalQuantity,
        totalPrice,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    req.flash("error", "Có lỗi xảy ra khi lấy giỏ hàng.");
    res.redirect("back");
  }
};


module.exports.addPost = async (req, res) => {
  try {
    const idProduct = req.params.id;
    const cartId = req.cookies.cartId;
    const quantity = parseInt(req.body.quantity);
    const size = req.body.size;
    

    const cart = await Cart.findById(cartId);
    const existProductInCart = cart.products.find(
      (item) => item.product_id.toString() === idProduct
    );

    if (existProductInCart) {

      await Cart.updateOne(
        { _id: cartId, "products.product_id": idProduct },
        {
          $setOnInsert: {
            "products.$.product_id": idProduct,
            "products.$.size": size,
          },
          $inc: { "products.$.quantity": quantity },
        },
        { upsert: true }
      );
    } else {
      const objectCart = {
        product_id: idProduct,
        quantity: quantity,
        size: size
      };
      await Cart.updateOne(
        { _id: cartId },
        { $push: { products: objectCart } }
      );
    }

    req.flash("success", "Thêm vào giỏ hàng thành công");
    res.redirect("back");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    req.flash("error", "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    res.redirect("back");
  }
};

module.exports.updatePatch = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const { quantity, size } = req.body;

    if (!cartId || !productId || !quantity) {
      req.flash("error", "Dữ liệu không hợp lệ");
      return res.redirect("back");
    }

    // Tìm giỏ hàng
    const cart = await Cart.findById(cartId);
    if (!cart) {
      req.flash("error", "Không tìm thấy giỏ hàng");
      return res.redirect("back");
    }

    // Kiểm tra sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(
      (item) => item.product_id.toString() === productId
    );

    if (productIndex === -1) {
      req.flash("error", "Sản phẩm không tồn tại trong giỏ hàng");
      return res.redirect("back");
    }

    // Cập nhật số lượng và kích thước
    cart.products[productIndex].quantity = parseInt(quantity, 10);
    if (size) cart.products[productIndex].size = size;

    // Lưu giỏ hàng
    await cart.save();

    req.flash("success", "Cập nhật giỏ hàng thành công");
    res.redirect("back");
  } catch (error) {
    console.error("Error updating cart:", error);
    req.flash("error", "Có lỗi xảy ra khi cập nhật giỏ hàng");
    res.redirect("back");
  }
};


module.exports.checkout = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const couponCode = req.query.coupon || null; // Lấy mã giảm giá từ query string
    const userId = res.locals.user?._id; // Lấy ID người dùng nếu đã đăng nhập

    // 📌 **1. Kiểm tra giỏ hàng**
    const cart = await Cart.findById(cartId).populate('products.product_id');
    if (!cart || cart.products.length === 0) {
      req.flash('error', 'Giỏ hàng của bạn trống.');
      return res.redirect('/cart');
    }

    // 📌 **2. Tính toán tổng giá trị giỏ hàng**
    let totalPrice = 0;
    const items = cart.products
      .map((item) => {
        const product = item.product_id;
        if (!product) return null;

        const discountAmount = Math.round((product.price * product.discountPercentage) / 100);
        const finalPrice = Math.round(product.price - discountAmount);

        totalPrice += finalPrice * item.quantity;

        return {
          product: {
            id: product._id,
            name: product.title,
            price: product.price,
            discountPercentage: product.discountPercentage,
            finalPrice,
            image: product.thumbnail?.[0],
          },
          quantity: item.quantity,
          totalPrice: finalPrice * item.quantity,
        };
      })
      .filter((item) => item !== null);

    // 🎟️ **3. Áp dụng mã giảm giá (nếu có)**
    let couponDiscount = 0;
    let couponDetails = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, is_active: true });

      if (!coupon) {
        req.flash('error', 'Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        return res.redirect('/cart');
      }

      // 📅 Kiểm tra ngày hết hạn
      const now = new Date();
      if (now < coupon.start_date || now > coupon.end_date) {
        req.flash('error', 'Mã giảm giá không còn hiệu lực.');
        return res.redirect('/cart');
      }

      // 🛒 Kiểm tra giá trị đơn hàng tối thiểu
      if (totalPrice < coupon.min_order_value) {
        req.flash(
          'error',
          `Đơn hàng phải có giá trị tối thiểu ${coupon.min_order_value} để áp dụng mã giảm giá.`
        );
        return res.redirect('/cart');
      }

      // 👥 Kiểm tra số lần sử dụng cho mỗi người dùng
      const userUsageCount = coupon.used_by.filter(
        (id) => id.toString() === userId.toString()
      ).length;

      if (userUsageCount >= coupon.usage_per_user) {
        req.flash('error', 'Bạn đã sử dụng mã giảm giá này tối đa số lần cho phép.');
        return res.redirect('/cart');
      }

      // 🔄 Kiểm tra giới hạn tổng số lần sử dụng
      if (coupon.usage_limit > 0 && coupon.used_by.length >= coupon.usage_limit) {
        req.flash('error', 'Mã giảm giá đã hết lượt sử dụng.');
        return res.redirect('/cart');
      }

      // 💸 Tính toán giảm giá
      if (coupon.discount_type === 'percentage') {
        couponDiscount = Math.round((totalPrice * coupon.discount_value) / 100);
      } else if (coupon.discount_type === 'fixed_amount') {
        couponDiscount = coupon.discount_value;
      }

      // Không cho phép giảm giá vượt quá tổng giá trị đơn hàng
      if (couponDiscount > totalPrice) {
        couponDiscount = totalPrice;
      }

      couponDetails = coupon;
      totalPrice -= couponDiscount; // Giảm giá trước khi cộng phí ship

      req.flash('success', `Mã giảm giá "${couponCode}" đã được áp dụng!`);
    }

    // 📦 **4. Áp dụng phí giao hàng sau khi giảm giá**
    const shippingFee = 50; // Phí giao hàng cố định
    const grandTotal = Math.max(totalPrice + shippingFee, 0);

    // 📌 **5. Render giao diện thanh toán**
    res.render('clients/pages/cart/checkout', {
      title: 'Thanh Toán',
      cart: {
        items,
        totalPrice,
        couponDiscount,
        shippingFee,
        grandTotal,
      },
      coupon: couponDetails,
      couponCode,
      user: res.locals.user
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    req.flash('error', 'Có lỗi xảy ra khi tải trang thanh toán.');
    res.redirect('/cart');
  }
};


module.exports.checkoutPost = async (req, res) => {
  try {
    const { recipientName, phoneNumber, address, paymentMethod, couponCode, customerNote } = req.body;
    const cartId = req.cookies.cartId;
    const user_id = res.locals.user?._id;

    // 📌 **1. Kiểm tra xác thực người dùng**
    if (!user_id) {
      req.flash('error', 'Bạn cần đăng nhập để đặt hàng.');
      return res.redirect('/auth/login');
    }

    // 📌 **2. Kiểm tra giỏ hàng**
    const cart = await Cart.findById(cartId).populate('products.product_id');
    if (!cart || cart.products.length === 0) {
      req.flash('error', 'Giỏ hàng của bạn trống.');
      return res.redirect('back');
    }

    // 📌 **3. Tính toán chi tiết đơn hàng**
    let totalPrice = 0;
    const items = cart.products.map((product) => {
      const { product_id, quantity, size } = product;

      if (!product_id) {
        throw new Error('Sản phẩm trong giỏ hàng không tồn tại hoặc đã bị xóa.');
      }

      const priceAtPurchase = Math.round(product_id.price * ((100 - product_id.discountPercentage) / 100));
      const total_price = Math.round(priceAtPurchase * quantity);
      totalPrice += total_price;

      return {
        product_id: product_id._id,
        quantity,
        priceAtPurchase,
        total_price,
        size,
      };
    });

    // 🎟️ **4. Áp dụng mã giảm giá (nếu có)**
    let discount = 0;
    let couponDetails = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({code:couponCode});
      if (coupon) {
        discount = coupon.discount_type === 'percentage'
          ? Math.round((totalPrice * coupon.discount_value) / 100)
          : coupon.discount_value;

        discount = Math.min(discount, totalPrice); // Không vượt quá tổng tiền
        totalPrice -= discount;
        couponDetails = { coupon_id: coupon._id, discountValue: discount };
        coupon.used_by.push(user_id);
        await coupon.save();
      }
    }

    // 📦 **5. Áp dụng phí giao hàng**
    const shippingFee = 0; // Phí giao hàng cố định
    totalPrice = Math.max(totalPrice + shippingFee, 0);

    // 📑 **6. Tạo đơn hàng mới**
    const newOrder = new Order({
      user_id,
      recipientName,
      phoneNumber,
      address,
      items,
      totalPrice,
      shippingFee,
      discount,
      paymentMethod,
      coupon: couponDetails || undefined,
      customerNote: customerNote || '',
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await newOrder.save();
    await Cart.findByIdAndDelete(cartId);

    const emailHTML = emailHelper.generateOrderEmailHTML(newOrder);
    emailHelper.sendMail("lethuong6924@gmail.com", 'Thông báo đơn hàng', emailHTML);

    req.flash('success', 'Đơn hàng của bạn đã được đặt thành công!');
    res.redirect(`/order/detail/${newOrder._id}`);
  } catch (error) {
    console.error('Error during checkoutPost:', error);
    req.flash('error', 'Đã xảy ra lỗi trong quá trình đặt hàng.');
    res.redirect('back');
  }
};



module.exports.ordered = async (req, res) => {
  try {

    const userId = res.locals.user._id;

    // Lấy danh sách đơn hàng của người dùng
    const orders = await Order.find({
      user_id: userId,
      deleted: false, 
      status: { $nin: ["completed", "canceled"] }
    })
      .populate("items.product_id", "title thumbnail price") 
      .populate("coupon.coupon_id", "code discount_value") 
      .lean(); 

    if (orders.length === 0) {
      return res.render("clients/pages/cart/ordered", {
        title: "Thông tin đơn hàng",
        orders: [],
        message: "Bạn chưa có đơn hàng nào.",
      });
    }

    // Render danh sách đơn hàng
    res.render("clients/pages/cart/ordered", {
      title: "Thông tin đơn hàng",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    req.flash("error", "Đã xảy ra lỗi khi lấy thông tin đơn hàng.");
    res.redirect("/cart");
  }
};

module.exports.deleteCartItem = async (req, res) => {
  try {
    const cartId = req.cookies.cartId; // Lấy ID giỏ hàng từ cookie
    const productId = req.params.productId; // Lấy ID sản phẩm từ params

    if (!cartId || !productId) {
      req.flash("error", "Dữ liệu không hợp lệ");
      return res.redirect("back");
    }

    // Tìm giỏ hàng theo ID
    const cart = await Cart.findById(cartId);
    if (!cart) {
      req.flash("error", "Không tìm thấy giỏ hàng");
      return res.redirect("back");
    }

    // Lọc ra các sản phẩm không muốn xóa
    const initialCount = cart.products.length;
    cart.products = cart.products.filter(
      (item) => item.product_id.toString() !== productId
    );

    // Kiểm tra xem sản phẩm có bị xóa không
    if (initialCount === cart.products.length) {
      req.flash("error", "Sản phẩm không tồn tại trong giỏ hàng");
      return res.redirect("back");
    }

    // Lưu lại giỏ hàng sau khi xóa sản phẩm
    await cart.save();

    req.flash("success", "Xóa sản phẩm thành công");
    res.redirect("back");
  } catch (error) {
    console.error("Error deleting cart item:", error);
    req.flash("error", "Có lỗi xảy ra khi xóa sản phẩm");
    res.redirect("back");
  }
};

module.exports.clearCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId; // Lấy ID giỏ hàng từ cookie

    if (!cartId) {
      req.flash("error", "Không tìm thấy giỏ hàng.");
      return res.redirect("back");
    }

    const result = await Cart.findByIdAndUpdate(cartId, { $set: { products: [] } });

    if (!result) {
      req.flash("error", "Không thể xóa giỏ hàng.");
      return res.redirect("back");
    }

    req.flash("success", "Giỏ hàng đã được xóa thành công.");
    res.redirect("back");
  } catch (error) {
    console.error("Error clearing cart:", error);
    req.flash("error", "Có lỗi xảy ra khi xóa giỏ hàng.");
    res.redirect("back");
  }
};

