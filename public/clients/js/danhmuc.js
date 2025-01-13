function darkFunction() {
  var elmt = document.body;
  elmt.classList.toggle("dark-mode");
}
// Click hambergur menu
function burgerFunction() {
  const overlay = document.querySelector(".menu-overlay");
  const menuDrawer = document.querySelector(".menu-drawer");
  overlay.classList.toggle("active");
  menuDrawer.classList.toggle("active");
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
  setInterval(imgSlide, 5000);
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

function updatePage(page) {
  // Lấy URL hiện tại
  const currentUrl = new URL(window.location.href);

  // Cập nhật query parameter `page`
  currentUrl.searchParams.set('page', page);

  // Chuyển hướng đến URL mới
  window.location.href = currentUrl.toString();
}