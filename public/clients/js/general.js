document.addEventListener("DOMContentLoaded", function () {
  // Hiển thị thông báo
  const alerts = document.querySelectorAll("[show-alert]");
  alerts.forEach((alert) => {
    const time = alert.getAttribute("data-time") || 5000; // Thời gian mặc định là 5000ms
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-20px)";
      setTimeout(() => alert.remove(), 300); // Xóa phần tử sau khi ẩn
    }, time);
  });

  // Đóng thông báo khi nhấn vào "x"
  document.addEventListener("click", function (e) {
    if (e.target.matches("[close-alert]")) {
      const alert = e.target.closest(".alert");
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-20px)";
      setTimeout(() => alert.remove(), 300);
    }
  });

  const inputsSort = document.querySelectorAll('input[name="sort"]');

  if (inputsSort) {
    inputsSort.forEach((radio) => {
      radio.addEventListener("change", function () {
        const selectedSort = this.value;
        const currentUrl = new URL(window.location.href);

        // Cập nhật query `sort` trên URL
        currentUrl.searchParams.set("sort", selectedSort);

        // Điều hướng lại trang với query mới
        window.location.href = currentUrl.toString();
      });
    });
  }

  const applyFilterButton = document.querySelector(".btn-custom-filter");

  if (applyFilterButton) {
    applyFilterButton.addEventListener("click", function () {
      try {
        const filters = {};

        // Lấy các bộ lọc giá đã chọn
        const priceFilters = Array.from(
          document.querySelectorAll('input[name="price-filter"]:checked')
        ).map((input) => input.getAttribute("data-price"));
        if (priceFilters.length > 0) {
          filters.price = priceFilters.join(",");
        }

        // Lấy các bộ lọc chất liệu đã chọn
        const materialFilters = Array.from(
          document.querySelectorAll(
            '.collection-filter-chatlieu input[type="checkbox"]:checked'
          )
        ).map((input) => input.getAttribute("data-value"));
        if (materialFilters.length > 0) {
          filters.material = materialFilters.join(",");
        }

        // Lấy các bộ lọc loại sản phẩm đã chọn
        const typeFilters = Array.from(
          document.querySelectorAll(
            '.collection-filter-loaisanpham input[type="checkbox"]:checked'
          )
        ).map((input) => input.getAttribute("data-value"));
        if (typeFilters.length > 0) {
          filters.type = typeFilters.join(",");
        }

        // Kiểm tra nếu không có bộ lọc nào được chọn
        if (Object.keys(filters).length === 0) {
          alert("Vui lòng chọn ít nhất một bộ lọc!");
          return;
        }

        // Tạo query string từ filters
        const queryParams = new URLSearchParams(filters).toString();

        // Điều hướng đến URL mới với query
        window.location.href = `${window.location.pathname}?${queryParams}`;
      } catch (error) {
        console.error("Lỗi khi áp dụng bộ lọc:", error);
        alert("Đã xảy ra lỗi khi áp dụng bộ lọc. Vui lòng thử lại.");
      }
    });
  }
});


// Function to handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter") {
    const input = event.target;
    const searchValue = input.value.trim();
    if (searchValue) {
      // Redirect to URL with query parameter
      window.location.href = `/products?query=${encodeURIComponent(searchValue)}`;
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("query");
      window.location.href = url
      event.preventDefault();
    }
  }
}
