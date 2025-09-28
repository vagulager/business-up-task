import Swiper from 'swiper';
import { Keyboard, EffectFade, Autoplay, Thumbs, A11y } from 'swiper/modules';
import { isMobile } from '../functions/check-viewport.js';

Swiper.use([Keyboard, EffectFade, Autoplay, Thumbs, A11y]);

const hero = document.querySelector('.hero');
const heroSlider = document.querySelector('.hero__slider');
const heroThumbSlider = document.querySelector('.hero__thumb-slider');
const heroVideo = document.querySelector('.hero__video');
const heroSlides = document.querySelectorAll('.hero__slider .swiper-slide');
const thumbSlides = document.querySelectorAll(
  '.hero__thumb-slider .swiper-slide'
);

const ENABLED = true;
const AUTOPLAY = true;

if (ENABLED && hero && heroSlider && heroThumbSlider) {
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
        heroThumbSlider.setAttribute('data-autoplay', AUTOPLAY);
        changeHeroBackground(this.activeIndex);
        updateAriaAttributes(this.activeIndex);

        setTimeout(() => {
          heroThumbSlider
            .querySelector('.swiper-slide-initial')
            .classList.remove('swiper-slide-initial');
        }, 500);
      },
      slideChangeTransitionEnd: function () {
        changeHeroBackground(this.activeIndex);
      },
      slideChange: function () {
        hero.setAttribute('data-transition', true);
        updateAriaAttributes(this.activeIndex);
      },
      autoplayTimeLeft: function (swiper, _, progress) {
        const _progress = Math.floor((1 - progress) * 100);

        if (isMobile()) {
          thumbSlides.forEach((item, index) => {
            item.setAttribute(
              'data-progress',
              index < this.activeIndex ? '100' : '0'
            );
            item.style.setProperty(
              '--progress-width',
              index < this.activeIndex ? '100%' : '0'
            );
          });
        } else {
          thumbSlides.forEach((item) => {
            item.style.setProperty('--progress-width', '0');
            item.setAttribute('data-progress', '0');
          });
        }

        thumbSlides[swiper.activeIndex].setAttribute(
          'data-progress',
          _progress
        );
        thumbSlides[swiper.activeIndex].style.setProperty(
          '--progress-width',
          `${_progress}%`
        );
      },
    },
  });

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

    if (heroVideo) {
      hero.setAttribute('data-has-video', Boolean(video));
      heroVideo.src = heroVideo.getAttribute('src') !== video ? video : '';
    }

    hero.style.setProperty(
      '--bg-image',
      `image-set(url('${imageWebp}') type('image/webp'), url('${imageJpg}') type('image/jpg'))`
    );

    hero.setAttribute('data-transition', 'false');
  }

  function updateAriaAttributes(activeIndex) {
    heroSlides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      const slideLink = slide.querySelector('.hero__slide-link');

      slide.setAttribute('aria-hidden', !isActive);
      slide.setAttribute('tabindex', isActive ? '0' : '-1');
      slide.setAttribute('aria-current', isActive ? 'true' : 'false');

      if (slideLink) {
        slideLink.tabIndex = isActive ? 0 : -1;
      }
    });

    thumbSlides.forEach((thumb, index) => {
      const isActive = index === activeIndex;

      thumb.setAttribute('aria-selected', isActive);
      thumb.setAttribute('aria-label', `Слайд ${index + 1}`);
      thumb.setAttribute('aria-current', isActive ? 'true' : 'false');
      thumb.setAttribute('data-index', index);
    });
  }

  (function setupHeroSliderKeyboardNav() {
    let isSliderFocused = false;

    heroSlides.forEach((slide) => {
      slide.addEventListener('focus', () => {
        isSliderFocused = true;
        heroSlider.setAttribute('data-focused', 'true');
      });

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
  })();

  (function setupThumbSliderKeyboardNav() {
    let isThumbFocused = false;

    thumbSlides.forEach((thumb) => {
      thumb.addEventListener('focus', () => {
        isThumbFocused = true;
      });

      thumb.addEventListener('blur', () => {
        isThumbFocused = false;
      });
    });

    document.addEventListener('keydown', (e) => {
      if (!isThumbFocused) return;

      const keyHandlers = {
        Enter: () =>
          heroSliderSwiper.slideTo(e.target.getAttribute('data-index')),
      };

      if (keyHandlers[e.key]) {
        keyHandlers[e.key]();
        heroSlider.querySelector('.swiper-slide-active').focus();
        e.preventDefault();
      }
    });
  })();
}
