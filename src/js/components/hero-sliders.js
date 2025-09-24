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
const heroVideo = document.querySelector('#hero-video');

const AUTOPLAY = true;

if (hero && heroSlider && heroThumbSlider) {
  const heroThumbSliderSwiper = new Swiper(heroThumbSlider, {
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    allowTouchMove: false,
  });

  const heroSliderSwiper = new Swiper(heroSlider, {
    loop: false,
    effect: 'fade',
    freeMode: false,
    allowTouchMove: false,
    fadeEffect: {
      crossFade: true,
    },
    speed: 250,
    autoplay: AUTOPLAY && {
      delay: 5000,
    },
    thumbs: {
      slideThumbActiveClass: 'swiper-slide-active',
      swiper: heroThumbSliderSwiper,
    },
    on: {
      init: function () {
        this.update();
        setTimeout(() => {
          progressBarAnimation(this.realIndex);
          changeHeroBackground(this.realIndex);
        }, 100);
      },
      beforeSlideChangeStart: function () {
        hero.setAttribute('data-transition', true);

        document
          .querySelectorAll('#hero-thumb-slider .swiper-slide')
          .forEach((item) => {
            item.style.setProperty('--progress-width', '0');
            item.setAttribute('data-progress', '0');
          });
      },
      slideChangeTransitionEnd: function () {
        progressBarAnimation(this.realIndex);
        changeHeroBackground(this.realIndex);
      },
      realIndexChange: function () {
        setTimeout(() => {
          progressBarAnimation(this.realIndex);
        }, 50);
      },
    },
  });

  function progressBarAnimation(index) {
    if (!AUTOPLAY) return;

    const thumbSlides = document.querySelectorAll(
      '#hero-thumb-slider .swiper-slide'
    );

    const safeIndex = Math.max(0, Math.min(index, thumbSlides.length - 1));

    thumbSlides.forEach((item) => {
      item.style.setProperty('--progress-width', '0');
      item.setAttribute('data-progress', '0');
    });

    if (thumbSlides[safeIndex]) {
      requestAnimationFrame(() => {
        thumbSlides[safeIndex].style.setProperty('--progress-width', '100%');
        thumbSlides[safeIndex].setAttribute('data-progress', '100');
      });
    }
  }

  function changeHeroBackground(index) {
    const heroSlides = document.querySelectorAll('#hero-slider .swiper-slide');
    const safeIndex = Math.max(0, Math.min(index, heroSlides.length - 1));
    const activeSlide = heroSlides[safeIndex];

    if (!activeSlide) return;

    const video = activeSlide.getAttribute('data-video');
    const imageWebp = activeSlide.getAttribute('data-image-webp');
    const imageJpg = activeSlide.getAttribute('data-image-jpg');

    if (video && heroVideo) {
      hero.setAttribute('data-has-video', 'true');
      if (heroVideo.getAttribute('src') !== video) {
        heroVideo.src = video;
      }
    } else {
      hero.setAttribute('data-has-video', 'false');
      heroVideo.src = '';
    }

    hero.style.setProperty(
      '--bg-image',
      `image-set(url('${imageWebp}') type('image/webp'), url('${imageJpg}') type('image/jpg'))`
    );

    setTimeout(() => {
      hero.setAttribute('data-transition', 'false');
    }, 200);
  }

  // Дополнительная синхронизация при ручном переключении thumb
  heroThumbSliderSwiper.on('slideChange', function () {
    const realIndex = heroSliderSwiper.realIndex;
    progressBarAnimation(realIndex);
    changeHeroBackground(realIndex);
  });
}
