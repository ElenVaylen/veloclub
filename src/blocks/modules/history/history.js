import $ from 'jquery';
import 'slick-carousel';

$(document).ready(function(){
  $('.history__slider').slick({
    lazyLoad: 'ondemand',
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    asNavFor: '.history__dots',
    speed: 500,
    fade: true,
    cssEase: 'linear',
  });
  $('.history__dots').slick({
    lazyLoad: 'ondemand',
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    asNavFor: '.history__slider',
    dots: false,
    draggable: true,
    responsive: [
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  });
  $('.history__nav-prev').on('click', function(e){
    e.preventDefault();
    $('.history__slider').slick('slickPrev');
  });
  $('.history__nav-next').on('click', function(e){
    e.preventDefault();
    $('.history__slider').slick('slickNext');
  });
});