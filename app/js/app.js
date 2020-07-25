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

// работа с модальным окном
let openModal = $('#callback-link-js');
let modalWindow = $('#modal-js');
let closeModal = $('#modal__close-js');
let body = $('#body-js');

$(openModal).click(function (e) {
  e.preventDefault();
  $(modalWindow).fadeIn(500);
  $(body).addClass('no-scroll');
});

$(closeModal).click(function(){
  $(modalWindow).fadeOut(250);
  setTimeout(function () {
    $(body).removeClass('no-scroll');
  }, 250);
});

// скрывание слайдера

  // let sliderImg = $('.slider__img');
  // let sliderImgWidth = $('.slider__img').inneridth();
  // let browserWindowWidth = window.innerWidth;

  function removeSlider() {
    // Выполняем действие, если ширина меньше ширины картинки в слайдере
    let browserWindowWidth = window.innerWidth;
    if (browserWindowWidth < 768) {
      $('#slider-js').remove();
    }
  }

let browserWindowWidth = window.innerWidth;
if (browserWindowWidth < 768) {
  $('#slider-js').remove();
}

  // Выполняем заново при изменении размера окна
  window.addEventListener('resize', function () {
    removeSlider();
  });

// валидация формы
$('#form-js').submit(function (e) {
  e.preventDefault();
  var name = $('#name').val();
  var phone = $('#phone').val();
  var email = $('#email').val();
  var message = $('#message').val();

  $(".error").remove();

  if (name.length < 1) {
    $('#name').addClass('error').attr('placeholder', 'Это поле обязательно для заполнения');
  }
  if (phone.length < 1) {
    $('#phone').addClass('error').attr('placeholder', 'Это поле обязательно для заполнения');
  }
  if (email.length < 1) {
    $('#email').addClass('error').attr('placeholder', 'Это поле обязательно для заполнения');
  } else {
    var regEx = /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:[A-Z0-9-]{1,63}.){1,125}[A-Z]{2,63}$/;
    var validEmail = regEx.test(email);
    if (!validEmail) {
      $('#email').addClass('error').attr('placeholder', 'Введите действительный email-адрес');
    }
  }
  if (message.length < 8) {
    $('#message').addClass('error').attr('placeholder', 'Длина сообщения должна быть не менее 8 символов ');
  }
});