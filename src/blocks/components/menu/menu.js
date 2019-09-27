document.addEventListener('DOMContentLoaded', function() {
  let switchMenu = () => {
    let menuBar = document.querySelector('.menu__bar');
    let menuClose = document.querySelector('.menu__close');
    let body = document.querySelector('.body');
    menuBar.addEventListener('click', function() {
      body.classList.add("menu-open");
    });
    menuClose.addEventListener('click', function() {
      body.classList.remove("menu-open");
    });
  };
  switchMenu();
}, false);