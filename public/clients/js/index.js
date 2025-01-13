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
    imageMarquee.src = "./img/index-marquee-light.png";
    imgWrapShadows.forEach((element) => {
      element.style.boxShadow = "0px 60px 20px 0px rgba(237, 237, 246, 0.20)";
    });
  }
}

//Load slider
function loadImage() {
  const imgPosition = document.querySelectorAll(".hero-slider img");
  const imgContainer = document.querySelector(".hero-slider");
  const dotItem = document.querySelectorAll(".dot");
  let imgNumber = imgPosition.length;
  let index = 0;
  imgPosition.forEach(function (image, index) {
    image.style.left = index * 100 + "%";
    dotItem[index].addEventListener("click", function () {
      slide(index);
    });
  });
  function imgSlide() {
    index++;
    if (index >= imgNumber) {
      index = 0;
    }
    slide(index);
  }

  function slide(index) {
    imgContainer.style.left = index * -100 + "%";
    const dotActive = document.querySelector(".dot-container .dot.active");
    dotActive.classList.remove("active");
    dotItem[index].classList.add("active");
  }
  setInterval(imgSlide, 2000);
}

//Load Reviews
function loadReview() {
  const reviews = document.querySelectorAll(".home-review");
  const rvContainer = document.querySelector(".review-container");
  const dotReview = document.querySelectorAll(".dot-review");
  let rvNumber = reviews.length;
  let index_rv = 0;
  reviews.forEach(function (review, index_rv) {
    review.style.left = index_rv * 100 + "%";
    dotReview[index_rv].addEventListener("click", function () {
      slide_rv(index_rv);
    });
  });
  function rvSlide() {
    index_rv++;
    if (index_rv >= rvNumber) {
      index_rv = 0;
    }
    slide_rv(index_rv);
  }

  function slide_rv(index_rv) {
    rvContainer.style.left = index_rv * -100 + "%";
    const dot_rvActive = document.querySelector(
      ".dot-container-review .dot-review.active"
    );
    dot_rvActive.classList.remove("active");
    dotReview[index_rv].classList.add("active");
  }
  setInterval(rvSlide, 5000);
}

// Click heart icon
function heart(hinhDuocClick) {
  hinhDuocClick.classList.toggle("active");

  if (hinhDuocClick.classList.contains("active")) {
    hinhDuocClick.src = "./icon/heart-red.svg";
    IncreaseWL();
  } else {
    hinhDuocClick.src = "./icon/heart.svg";
    DecreaseWL();
  }
}

// Click "-"
function DecreaseWL() {
  var count = parseInt(document.getElementById("wishlist").innerHTML);
  if (count > 0) {
    count--;
    document.getElementById("wishlist").innerHTML = count;
  }
}
//Click "+"
function IncreaseWL() {
  var count = parseInt(document.getElementById("wishlist").innerHTML);
  count++;
  document.getElementById("wishlist").innerHTML = count;
}
