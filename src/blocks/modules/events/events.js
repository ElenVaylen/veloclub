import $ from 'jquery';

let getWindowWidth = () => {
  return $(window).width();
};

let tabsContent = (thisEvent) => {
  if(!thisEvent.hasClass('active')) {
    let titleData = thisEvent.data().title;
    $('.events__titles-item').not(thisEvent).removeClass('active');
    $('.events__content-item').not($('.events__content-item' + titleData)).removeClass('active');
    thisEvent.addClass('active');
    $('.events__content-item' + titleData).addClass('active'); 
  }
};

let tabs = (thisEvent, switchSlider) => {
  tabsContent(thisEvent);
  switchSlider(thisEvent);
};

const switchSlider = (thisEvent) => {
  let titleData = thisEvent.data().title;
  if((getWindowWidth() <= 1365)) {
    if(!$('.events__content-item' + titleData).find('.events-slider').hasClass('slick-initialized')) {
      $('.events__content-item').each(function() {
        if(!$(this).hasClass('.events__content-item' + titleData)) {
          $(this).find('.events-slider.slick-initialized').slick('unslick');
        }
      });
      
      $('.events__content-item' + titleData).find('.events-slider').slick({
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 1,
        dotsClass: 'dots',
        arrows: false,
      });
    }
  } else {
    if($('.events__content-item' + titleData).find('.events-slider').hasClass('slick-initialized')) {
      $('.events__content-item' + titleData).find('.events-slider').slick('unslick');
    }
  }
};

$(document).ready(function(){
  $('.events__titles-item:nth-child(1)').addClass('active');
  $('.events__content-item:nth-child(1)').addClass('active');

  
  switchSlider($('.events__titles-item:nth-child(1)'));

  $('.events__titles-item').click(function() {
    let thisEvent = $(this);
    tabs(thisEvent, switchSlider);
  });
  
});