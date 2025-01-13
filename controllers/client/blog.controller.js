module.exports.index = async (req, res) => {
  try {
    // Render trang danh sách blogs (nếu cần giữ lại giao diện, bạn có thể sửa lại nội dung)
    res.render('clients/pages/blogs/index', {
      title: 'Blogs',
      message: 'Danh sách blogs từ cửa hàng của chúng tôi.',
    });
  } catch (error) {
    console.error('Lỗi khi tải trang blogs:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi tải trang blogs!');
    res.redirect('/');
  }
};

module.exports.detail = async (req, res) => {
  try {
    // Thông báo lỗi vì chi tiết bài viết không còn khả dụng
    req.flash('error', 'Trang chi tiết không tồn tại!');
    res.redirect('/blogs');
  } catch (error) {
    console.error('Lỗi khi tải trang chi tiết:', error.message);
    req.flash('error', 'Có lỗi xảy ra khi tải trang chi tiết!');
    res.redirect('/blogs');
  }
};
