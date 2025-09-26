import Swiper from 'swiper';
import { Keyboard, EffectFade, Autoplay, Thumbs, A11y } from 'swiper/modules';
import { isMobile } from '../functions/check-viewport.js';

Swiper.use([Keyboard, EffectFade, Autoplay, Thumbs, A11y]);

const hero = document.querySelector('.hero');
const heroSlider = document.querySelector('#hero-slider');
const heroThumbSlider = document.querySelector('#hero-thumb-slider');
const heroVideo = document.querySelector('#hero-video');
const heroSlides = document.querySelectorAll('#hero-slider .swiper-slide');
const thumbSlides = document.querySelectorAll(
  '#hero-thumb-slider .swiper-slide'
);

const AUTOPLAY = false;

if (hero && heroSlider && heroThumbSlider) {
  const heroThumbSliderSwiper = new Swiper(heroThumbSlider, {
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    allowTouchMove: false,
    a11y: {
      itemRoleDescriptionMessage: 'Миниатюра слайда',
    },
  });

  const heroSliderSwiper = new Swiper(heroSlider, {
    loop: false,
    effect: 'fade',
    freeMode: false,
    allowTouchMove: false,
    a11y: {
      prevSlideMessage: 'Предыдущий слайд',
      nextSlideMessage: 'Следующий слайд',
      firstSlideMessage: 'Это первый слайд',
      lastSlideMessage: 'Это последний слайд',
      containerRoleDescriptionMessage: 'Слайдер',
    },
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
        progressBarAnimation(this.activeIndex);
        changeHeroBackground(this.activeIndex);
        updateAriaAttributes(this.activeIndex);
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
        progressBarAnimation(this.activeIndex);
        changeHeroBackground(this.activeIndex);
      },
      slideChange: function () {
        updateAriaAttributes(this.activeIndex);
      },
      realIndexChange: function () {
        setTimeout(() => {
          progressBarAnimation(this.activeIndex);
        }, 50);
      },
    },
  });

  setupKeyboardNavigation();
}

function progressBarAnimation(index) {
  if (!AUTOPLAY) return;

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
  const safeIndex = Math.max(0, Math.min(index, heroSlides.length - 1));
  const activeSlide = heroSlides[safeIndex];

  if (!activeSlide) return;

  const video = activeSlide.getAttribute('data-video');
  const imageWebp = isMobile()
    ? activeSlide.getAttribute('data-mobile-image-webp')
    : activeSlide.getAttribute('data-image-webp');
  const imageJpg = isMobile()
    ? activeSlide.getAttribute('data-mobile-image-jpg')
    : activeSlide.getAttribute('data-image-jpg');

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

function updateAriaAttributes(activeIndex) {
  heroSlides.forEach((slide, index) => {
    const isActive = index === activeIndex;
    slide.setAttribute('aria-hidden', !isActive);
    slide.setAttribute('tabindex', isActive ? '0' : '-1');

    if (isActive) {
      slide.setAttribute('aria-current', 'true');
    } else {
      slide.removeAttribute('aria-current');
    }

    if (slide.querySelector('.hero__slide-link')) {
      slide.querySelector('.hero__slide-link').tabIndex =
        slide.classList.contains('swiper-slide-active') ? 0 : -1;
    }
  });

  thumbSlides.forEach((thumb, index) => {
    const isActive = index === activeIndex;
    thumb.setAttribute('aria-selected', isActive);
    thumb.setAttribute('aria-label', `Слайд ${index + 1}`);
    thumb.setAttribute('role', 'tab');

    if (isActive) {
      thumb.setAttribute('tabindex', '0');
    } else {
      thumb.setAttribute('tabindex', '-1');
    }
  });
}

function setupKeyboardNavigation() {
  let isSliderFocused = false;

  heroSlides.forEach((slide) => {
    slide.addEventListener('focus', () => {
      isSliderFocused = true;
      heroSlider.setAttribute('data-focused', 'true');
    });
  });

  heroSlides.forEach((slide) => {
    slide.addEventListener('blur', () => {
      isSliderFocused = false;
      heroSlider.removeAttribute('data-focused');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!isSliderFocused) return;

    const keyHandlers = {
      ArrowLeft: () => heroSliderSwiper.slidePrev(),
      ArrowRight: () => heroSliderSwiper.slideNext(),
      Home: () => heroSliderSwiper.slideTo(0),
      End: () => heroSliderSwiper.slideTo(heroSlides.length - 1),
    };

    if (keyHandlers[e.key]) {
      keyHandlers[e.key]();
      heroSlider.querySelector('.swiper-slide-active').focus();
      e.preventDefault();
    }
  });
}
