import $ from 'jquery';
import 'slick-carousel';

$(document).ready(function(){
  $('.partners__slider').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    lazyLoad: 'ondemand',
    infinite: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  });
});