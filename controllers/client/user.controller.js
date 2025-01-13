const User = require("../../models/user.model");
const md5 = require("md5");

module.exports.index = async (req, res) => {
  try {
    // Render giao diện, sử dụng biến toàn cục `user` từ `res.locals`
    res.render('clients/pages/user/index', {
      title: 'Thông Tin Tài Khoản',
      message: 'Chào mừng bạn đến với tài khoản của mình!',
    });
  } catch (error) {
    console.error('❌ Lỗi khi xử lý index:', error.message);
    res.status(500).send('Đã xảy ra lỗi, vui lòng thử lại sau.');
  }
};



module.exports.updateProfile = async (req, res) => {
  try {
    const user = res.locals.user; // Lấy thông tin người dùng hiện tại từ session

    // Lấy thông tin từ form
    const { fullName, email, gender, phone, dob, address, username, password } = req.body;

    // Tạo đối tượng dữ liệu để cập nhật
    const updateData = {
      fullName,
      email,
      gender,
      phone,
      dob: new Date(dob), // Chuyển đổi ngày sinh
      address,
      username,
    };
    
    if (password) {
      const hashedPassword = md5(password);
      updateData.password = hashedPassword; // Thêm mật khẩu mã hóa vào updateData
    }

    // Cập nhật người dùng trong cơ sở dữ liệu
    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });

    // Nếu không tìm thấy người dùng hoặc cập nhật thất bại
    if (!updatedUser) {
      req.flash('error', 'Có lỗi xảy ra khi cập nhật thông tin!');
      return res.redirect('back');
    }

    // Thông báo thành công và chuyển hướng lại trang
    req.flash('success', 'Thông tin cá nhân đã được cập nhật!');
    res.redirect('/user');
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật thông tin người dùng:', error.message);
    req.flash('error', 'Đã xảy ra lỗi, vui lòng thử lại.');
    res.redirect('back');
  }
};




