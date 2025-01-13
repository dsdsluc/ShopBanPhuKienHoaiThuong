// Click hambergur menu
function burgerFunction() {
    const overlay = document.querySelector(".menu-overlay");
    const menuDrawer = document.querySelector(".menu-drawer");
    overlay.classList.toggle("active");
    menuDrawer.classList.toggle("active");
  }
  function search() {
    const searchBox = document.querySelector(".search-box");
    searchBox.classList.add("active");
  }
  function closeSearch() {
    const searchBoxActive = document.querySelector(".search-box.active");
    searchBoxActive.classList.remove("active");
  }

    
  //Click dark mode button
  function darkFunction() {
    const element = document.body;
    element.classList.toggle("dark-mode");
   //Đổi ảnh icon xóa 
  }
  
  const imageDelete = document.querySelectorALL(".delete-icon img");
  if (element.classList.contains("dark-mode")) {
   imageDelete.forEach((element) => {
      element.src = "./icon/yeuthich-delete-dark.svg";
    });
  } else {
    element.src = "./icon/yeuthich-delete.svg";
    imageDelete.forEach((element) => {
      element.src = "./icon/yeuthich-delete.svg";
    });
  }
   

      

    




  