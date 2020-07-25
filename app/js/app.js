//= jquery-1.11.0.min.js
//= jquery-migrate-1.2.1.min.js
//= ../../node_modules/slick-carousel/slick/slick.min.js

// Slick slider init
  $('.slider').slick({
    dots: false,
    infinite: true,
    slidesToShow: 1,
    pauseOnHover: false,
    // adaptiveHeight: true,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: '<button class="slick-prev"><span class="btn-icon btn-left"></span></button>',
    nextArrow: '<button class="slick-next"><span class="btn-icon btn-right"></span></button>',
  });