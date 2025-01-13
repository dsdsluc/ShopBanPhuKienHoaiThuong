//Click dark mode button
function darkFunction() {
    const element = document.body;
    element.classList.toggle("dark-mode");
    // Đổi ảnh marquee chỉ khi bật dark-mode
    const header_bg = document.querySelector(".header background-color");
    const body_bg = document.querySelector("body background-color");
    const outline = document.querySelector(".signin-info border");
    const text1 = document.querySelector(".signin-text color");
    const text2 = document.querySelector(".email-text color");
    const text3 = document.querySelector(".pass-text color");
  }