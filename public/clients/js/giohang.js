// Click "-"
function Decrease() {
  var count = parseInt(document.getElementById("count").innerHTML);
  if (count > 0) {
    count--;
    document.getElementById("count").innerHTML = count;
  }
}
//Click "+"
function Increase() {
  var count = parseInt(document.getElementById("count").innerHTML);
  count++;
  document.getElementById("count").innerHTML = count;
}
// Click "-"
function Decrease1() {
  var count = parseInt(document.getElementById("count1").innerHTML);
  if (count > 0) {
    count--;
    document.getElementById("count1").innerHTML = count;
  }
}
//Click "+"
function Increase1() {
  var count = parseInt(document.getElementById("count1").innerHTML);
  count++;
  document.getElementById("count1").innerHTML = count;
}
// Click "-"
function Decrease2() {
  var count = parseInt(document.getElementById("count2").innerHTML);
  if (count > 0) {
    count--;
    document.getElementById("count2").innerHTML = count;
  }
}
//Click "+"
function Increase2() {
  var count = parseInt(document.getElementById("count2").innerHTML);
  count++;
  document.getElementById("count2").innerHTML = count;
}
// Click "-"
function Decrease3() {
  var count = parseInt(document.getElementById("count3").innerHTML);
  if (count > 0) {
    count--;
    document.getElementById("count3").innerHTML = count;
  }
}
//Click "+"
function Increase3() {
  var count = parseInt(document.getElementById("count3").innerHTML);
  count++;
  document.getElementById("count3").innerHTML = count;
}

function toggleCheckboxes() {
  var checkboxes = document.querySelectorAll(
    '.product-detail input[type="checkbox"]'
  );
  var masterCheckbox = document.getElementById("checkAll");

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = masterCheckbox.checked;
  }
}

function darkFunction() {
  const element = document.body;
  element.classList.toggle("dark-mode");
  // Đổi ảnh marquee chỉ khi bật dark-mode
  const imageReturn = document.querySelector(".return img");
  const imagePayment = document.querySelector(".payment img");
  const imageGuarantee = document.querySelector(".guarantee img");
  const imageDelivery = document.querySelector(".delivery img");
}

function toggleSizeList() {
  var sizeList = document.getElementById("sizeList");
  sizeList.style.display = sizeList.style.display === "none" ? "block" : "none";
}

function selectSize() {
  var sizeSelect = document.getElementById("sizeSelect");
  var selectedSize = sizeSelect.value;
  displaySelectedSize(selectedSize);
}

function setSize(size) {
  var sizeSelect = document.getElementById("sizeSelect");
  sizeSelect.value = size;
  displaySelectedSize(size);
  toggleSizeList();
}

function displaySelectedSize(size) {
  var selectedSizeElement = document.querySelector(".selected-size");
  selectedSizeElement.textContent = size !== "" ? size : "Chọn size";
}

function toggleSizeList2() {
  var sizeList2 = document.getElementById("sizeList2");
  sizeList2.style.display =
    sizeList2.style.display === "none" ? "block" : "none";
}

function selectSize2() {
  var sizeSelect2 = document.getElementById("sizeSelect2");
  var selectedSize2 = sizeSelect2.value;
  displaySelectedSize2(selectedSize2);
}

function setSize2(size) {
  var sizeSelect2 = document.getElementById("sizeSelect2");
  sizeSelect2.value = size;
  displaySelectedSize2(size);
  toggleSizeList2();
}

function displaySelectedSize2(size) {
  var selectedSize2Element = document.querySelector(".selected-size");
  selectedSize2Element.textContent = size !== "" ? size : "Chọn size";
}

function toggleSizeList3() {
  var sizeList3 = document.getElementById("sizeList3");
  sizeList3.style.display =
    sizeList3.style.display === "none" ? "block" : "none";
}

function selectSize3() {
  var sizeSelect3 = document.getElementById("sizeSelect3");
  var selectedSize3 = sizeSelect3.value;
  displaySelectedSize3(selectedSize3);
}

function setSize3(size) {
  var sizeSelect3 = document.getElementById("sizeSelect3");
  sizeSelect3.value = size;
  displaySelectedSize3(size);
  toggleSizeList3();
}

function displaySelectedSize3(size) {
  var selectedSize3Element = document.querySelector(".selected-size");
  selectedSize3Element.textContent = size !== "" ? size : "Chọn size";
}

function toggleSizeList4() {
  var sizeList4 = document.getElementById("sizeList4");
  sizeList4.style.display =
    sizeList4.style.display === "none" ? "block" : "none";
}

function selectSize4() {
  var sizeSelect4 = document.getElementById("sizeSelect4");
  var selectedSize4 = sizeSelect4.value;
  displaySelectedSize4(selectedSize4);
}

function setSize4(size) {
  var sizeSelect4 = document.getElementById("sizeSelect4");
  sizeSelect4.value = size;
  displaySelectedSize4(size);
  toggleSizeList4();
}

function displaySelectedSize4(size) {
  var selectedSize4Element = document.querySelector(".selected-size");
  selectedSize4Element.textContent = size !== "" ? size : "Chọn size";
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

