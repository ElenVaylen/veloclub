import $ from 'jquery';
import 'slick-carousel';

$(document).ready(function(){
  $('.history__slider').slick({
    lazyLoad: 'ondemand',
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    speed: 500,
    fade: true,
    cssEase: 'linear',
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