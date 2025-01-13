// Click hambergur menu
function burgerFunction() {
    const overlay = document.querySelector(".menu-overlay");
    const menuDrawer = document.querySelector(".menu-drawer");
    overlay.classList.toggle("active");
    menuDrawer.classList.toggle("active");
  }
  
  //Click dark mode button
  function darkFunction() {
    const element = document.body;
    element.classList.toggle("dark-mode");
    // Đổi ảnh marquee chỉ khi bật dark-mode
    const imageMarquee = document.querySelector(".mar img");
    //Đổi màu shadow của imgWrap khi qua dark mode
    const imgWrapShadows = document.querySelectorAll(".product-card");
    if (element.classList.contains("dark-mode")) {
      imageMarquee.src = "./img/index-marquee-dark.png";
      imgWrapShadows.forEach((element) => {
        element.style.boxShadow = "0px 20px 60px 0px rgba(0, 0, 0, 0.2)";
      });
    } else {
      imageMarquee.src = "./img/marquee-light.png";
      imgWrapShadows.forEach((element) => {
        element.style.boxShadow = "0px 60px 20px 0px rgba(237, 237, 246, 0.20)";
      });
    }
  }
  
  function search() {
    const searchBox = document.querySelector(".search-box");
    searchBox.classList.add("active");
  }
  function closeSearch() {
    const searchBoxActive = document.querySelector(".search-box.active");
    searchBoxActive.classList.remove("active");
  }
  
  // Click SẢN PHẨM
  function megaFunction() {
    const megamenu = document.querySelector(".mega-menu");
    megamenu.classList.toggle("active");
  }
  