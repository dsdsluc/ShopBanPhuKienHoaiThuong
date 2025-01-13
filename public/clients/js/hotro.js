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
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const faqQuestions = document.querySelectorAll('.faq-question');
  
    faqQuestions.forEach((question) => {
      const faqIcon = question.querySelector('.faq-icon'); // Icon trong câu hỏi
      const answer = question.nextElementSibling; // Nội dung câu trả lời
  
      // Đặt trạng thái ban đầu
      answer.style.display = 'none';
  
      question.addEventListener('click', () => {
        const isHidden = answer.style.display === 'none';
  
        // Thay đổi trạng thái hiển thị câu trả lời
        answer.style.display = isHidden ? 'block' : 'none';
  
        // Chuyển đổi icon
        faqIcon.src = isHidden
          ? '/clients/icon/hotro-minus.svg' // Icon dấu "-"
          : '/clients/icon/hotro-add.svg';  // Icon dấu "+"
      });
    });
  });
  

  
  
  
  
  
  
  