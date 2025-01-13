const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVICE,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SERVICE,
    to: email,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      // do something useful
    }
  });
};

module.exports.generateOrderEmailHTML = (order) => {
  const {
    recipientName,
    phoneNumber,
    address,
    items,
    totalPrice,
    shippingFee,
    discount,
    paymentMethod,
    status,
    deliveryUpdates,
    expectedDeliveryDate,
    customerNote,
  } = order;

  // Tạo danh sách sản phẩm
  const itemsHTML = items
    .map((item) => {
      return `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${
              item.product_id.title || "Sản phẩm không tồn tại"
            }</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${
              item.quantity
            }</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.priceAtPurchase.toLocaleString()}đ</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${(
              item.priceAtPurchase * item.quantity
            ).toLocaleString()}đ</td>
          </tr>
        `;
    })
    .join("");

  // Lấy trạng thái giao hàng gần nhất
  const latestDeliveryStatus =
    deliveryUpdates?.[deliveryUpdates.length - 1]?.status ||
    "Chưa có thông tin";

  // HTML email
  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thông báo đơn hàng</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              width: 80%;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #0084ff;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background: #0084ff;
              color: white;
              padding: 10px;
              border: 1px solid #ddd;
            }
            td {
              padding: 10px;
              border: 1px solid #ddd;
            }
            .footer {
              text-align: center;
              padding: 10px 0;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!</h1>
            </div>
            <p>Xin chào, <b>${recipientName}</b>,</p>
            <p>Chúng tôi đã nhận được đơn hàng của bạn. Dưới đây là thông tin chi tiết:</p>
    
            <h3>Thông tin người nhận</h3>
            <p><b>Tên:</b> ${recipientName}</p>
            <p><b>Số điện thoại:</b> ${phoneNumber}</p>
            <p><b>Địa chỉ:</b> ${address}</p>
    
            <h3>Thông tin sản phẩm</h3>
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
    
            <h3>Chi tiết thanh toán</h3>
            <p><b>Phương thức thanh toán:</b> ${paymentMethod}</p>
            <p><b>Phí vận chuyển:</b> ${shippingFee.toLocaleString()}đ</p>
            <p><b>Giảm giá:</b> -${discount.toLocaleString()}đ</p>
            <p><b>Tổng thanh toán:</b> ${totalPrice.toLocaleString()}đ</p>
    
            <h3>Trạng thái đơn hàng</h3>
            <p><b>Trạng thái:</b> ${
              status === "pending" ? "Đang chờ xử lý" : status
            }</p>
            <p><b>Trạng thái giao hàng:</b> ${latestDeliveryStatus}</p>
            <p><b>Dự kiến giao hàng:</b> ${
              expectedDeliveryDate
                ? new Date(expectedDeliveryDate).toLocaleDateString("vi-VN")
                : "Chưa có thông tin"
            }</p>
    
            ${
              customerNote
                ? `<h3>Ghi chú của khách hàng</h3>
                   <p>${customerNote}</p>`
                : ""
            }
    
            <div class="footer">
              <p>Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
