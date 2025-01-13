//Load slider
let list = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let dots = document.querySelectorAll('.slider .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

let active = 0;
let lengthItems = items.length - 1;

next.onclick = function(){
    if(active +1 > lengthItems){
        active = 0;
    } else {
        active = active + 1;
    }
    reloadSlider();
}

let refreshSlider = setInterval(()=> {list.click()}, 3000);
function reloadSlider(){
    // Kiểm tra active có lớn hơn hoặc bằng chiều dài của mảng items hay không
    if (active >= items.length) {
        active = 0; // Nếu có, thiết lập active về 0 để quay lại slide đầu tiên
    }
    let checkLeft = items[active].offsetLeft;
    list.style.left = -checkLeft + 'px';

    let lastActiveDot = document.querySelector('.slider .dots li.active');
    lastActiveDot.classList.remove('active');
    dots[active].classList.add('active');
    clearInterval(refreshSlider);
    refreshSlider = setInterval(()=>{next.click()}, 3000);
}
dots.forEach((li, key) => {
    li.addEventListener('click', function(){
        active = key;
        reloadSlider();
    })
})

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