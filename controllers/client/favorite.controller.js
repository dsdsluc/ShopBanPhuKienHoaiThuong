const Favorite = require('../../models/favorite.model');

module.exports.index = async (req, res) => {
    try {
        const user = res.locals.user;

        const favorite = await Favorite.findOne({ user_id: user._id }).populate({
            path: 'products.product_id', 
            select: 'title price thumbnail rating discountPercentage', 
        });
        
        if (!favorite || favorite.products.length === 0) {
            req.flash('success', 'Danh sách yêu thích của bạn đang trống.');
        }

        res.render("clients/pages/favorite/index", {
            title: "Trang sản phẩm yêu thích",
            favorite: favorite || { products: [] },
        });
    } catch (error) {
        console.error('Error fetching favorite:', error);
        req.flash('error', 'Đã xảy ra lỗi khi tải danh sách yêu thích.');
        res.redirect('back'); 
    }
};


module.exports.addToFavorite = async (req, res) => {
    try {
        const user = res.locals.user;

        const { product_id } = req.params;
        

        if (!product_id) {
            req.flash('error', 'Sản phẩm không hợp lệ.');
            return res.redirect('back');
        }

        // Tìm hoặc tạo danh sách yêu thích
        let favorite = await Favorite.findOne({ user_id: user._id });

        if (!favorite) {
            favorite = new Favorite({ user_id: user._id, products: [] });
        }

        // Kiểm tra sản phẩm đã có trong danh sách yêu thích chưa
        const alreadyExists = favorite.products.some(
            (product) => product.product_id.toString() === product_id
        );

        if (alreadyExists) {
            req.flash('info', 'Sản phẩm đã có trong danh sách yêu thích.');
            return res.redirect('/favorite');
        }

        favorite.products.push({ product_id });
        await favorite.save();

        req.flash('success', 'Sản phẩm đã được thêm vào danh sách yêu thích.');
        res.redirect('back'); // Chuyển hướng đến trang danh sách yêu thích
    } catch (error) {
        console.error('Error adding to favorite:', error);
        req.flash('error', 'Đã xảy ra lỗi khi thêm sản phẩm vào danh sách yêu thích.');
        res.redirect('back');
    }
};


module.exports.removeFromFavorite = async (req, res) => {
    try {
        const user = res.locals.user;
        // Lấy product_id từ params
        const { product_id } = req.params;
        if (!product_id) {
            req.flash('error', 'Sản phẩm không hợp lệ.');
            return res.redirect('back');
        }

        // Tìm danh sách yêu thích của người dùng
        let favorite = await Favorite.findOne({ user_id: user._id });

        if (!favorite) {
            req.flash('error', 'Danh sách yêu thích không tồn tại.');
            return res.redirect('back');
        }

        // Lọc sản phẩm cần xóa
        const initialLength = favorite.products.length;
        favorite.products = favorite.products.filter(
            (product) => product.product_id.toString() !== product_id
        );

        if (favorite.products.length === initialLength) {
            req.flash('info', 'Sản phẩm không tồn tại trong danh sách yêu thích.');
            return res.redirect('back');
        }

        // Lưu danh sách yêu thích sau khi xóa sản phẩm
        await favorite.save();

        req.flash('success', 'Sản phẩm đã được xóa khỏi danh sách yêu thích.');
        res.redirect('/favorite'); // Chuyển hướng về trang danh sách yêu thích
    } catch (error) {
        console.error('Error removing from favorite:', error);
        req.flash('error', 'Đã xảy ra lỗi khi xóa sản phẩm khỏi danh sách yêu thích.');
        res.redirect('back');
    }
};
