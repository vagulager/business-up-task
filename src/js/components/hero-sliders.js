import Swiper from 'swiper';
import {
  Navigation,
  Pagination,
  EffectFade,
  Autoplay,
  Thumbs,
} from 'swiper/modules';

Swiper.use([Navigation, Pagination, EffectFade, Autoplay, Thumbs]);

const hero = document.querySelector('.hero');
const heroSlider = document.querySelector('#hero-slider');
const heroThumbSlider = document.querySelector('#hero-thumb-slider');
const heroSlides = document.querySelectorAll('#hero-slider .swiper-slide');
const heroThumbSlides = document.querySelectorAll(
  '#hero-thumb-slider .swiper-slide'
);
const heroVideo = document.querySelector('#hero-video');

const AUTOPLAY = true;

if (hero && heroSlider && heroThumbSlider) {
  const heroThumbSliderSwiper = new Swiper(heroThumbSlider, {
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    slideToClickedSlide: true,
  });

  const heroSliderSwiper = new Swiper(heroSlider, {
    loop: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    speed: 250,
    autoplay: AUTOPLAY && {
      delay: 5000,
    },
    breakpoints: {
      768: {
        speed: 150,
      },
    },
    thumbs: {
      slideThumbActiveClass: 'swiper-slide-active',
      swiper: heroThumbSliderSwiper,
    },
    on: {
      init: function () {
        progressBarAnimation(this.realIndex);
        changeHeroBackground(this.realIndex);
      },
      beforeSlideChangeStart: function () {
        hero.setAttribute('data-transition', true);
      },
      slideChange: function () {
        progressBarAnimation(this.realIndex);
        changeHeroBackground(this.realIndex);
      },
    },
  });

  function progressBarAnimation(index) {
    heroThumbSlider.setAttribute('data-autoplay', AUTOPLAY);

    if (!AUTOPLAY) return;

    heroThumbSlides.forEach((item) => {
      item.setAttribute('data-progress', 0);
    });

    setTimeout(() => {
      if (heroThumbSlides[index])
        heroThumbSlides[index].setAttribute('data-progress', 100);
    });
  }

  function changeHeroBackground(index) {
    const video = heroSlides[index].getAttribute('data-video');
    const imageWebp = heroSlides[index].getAttribute('data-image-webp');
    const imageJpg = heroSlides[index].getAttribute('data-image-jpg');

    if (video && heroVideo) {
      hero.setAttribute('data-has-video', true);

      if (heroVideo.getAttribute('src') !== video) heroVideo.src = video;
    } else {
      hero.setAttribute('data-has-video', false);
      heroVideo.src = '';
    }

    setTimeout(() => {
      hero.style = `--bg-image: image-set(url('${imageWebp}') type('image/webp'), url('${imageJpg}'))`;
    }, 200);

    setTimeout(() => {
      hero.setAttribute('data-transition', false);
    }, 300);
  }
}
