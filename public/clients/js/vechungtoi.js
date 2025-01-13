
let i=0;
function darkFunction(){
    var elmt=document.body;
    elmt.classList.toggle("dark");
}
function next(){
  const imglist =document.querySelector(".ba-thanh-vien");
  const imgs = document.querySelectorAll(".mot-thanh-vien");
  let imgwidth = imgs[0].clientWidth*3;
  imglist.scrollLeft += imgwidth;
  i++;
    if(i<imgs.length/3){
        document.querySelector(".active").classList.remove("active");
        document.querySelector(".img-index-" +i).classList.add("active");
    }
    else{
      i--;
    }
      
}
function prev(){
  const imglist =document.querySelector(".ba-thanh-vien");
  const imgs = document.querySelectorAll(".mot-thanh-vien");
  let imgwidth = imgs[0].clientWidth*3;
  imglist.scrollLeft -= imgwidth; 
  i--;
    if(i>=0){
    document.querySelector(".active").classList.remove("active");
    document.querySelector(".img-index-" +i).classList.add("active");
    }
    else{
      i++;
    }
}
