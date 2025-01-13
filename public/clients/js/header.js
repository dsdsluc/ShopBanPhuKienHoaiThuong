function load(selector, path) {
  const cached = localStorage.getItem(path);
  if (cached) {
    document.querySelector(selector).innerHTML = cached;
  }

  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      if (html !== cached) {
        document.querySelector(selector).innerHTML = html;
        localStorage.setItem(path, html);
      }
    });
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
