import $ from 'jquery';
import '@fancyapps/fancybox';

let getWindowWidth = () => {
  return $(window).width();
};

let numbersSlider = () => {
  if((getWindowWidth() <= 767)) {
    if(!$('.numbers__list').hasClass('slick-initialized')) {
      $('.numbers__list').slick({
        dots: false,
        infinite: true,
        speed: 300,
        arrows: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        lazyLoad: 'ondemand',
        responsive: [
          {
            breakpoint: 424,
            settings: {
              slidesToShow: 1,
            }
          }
        ]
      });
    }
  } else {
    if($('.numbers__list').hasClass('slick-initialized')) {
      $('.numbers__list').slick('unslick');
    }
  }
};

$(document).ready(function(){

  $('.numbers__item-link').fancybox({
  });

  numbersSlider();

});

$(window).resize(function() {
  numbersSlider();
});