import { disableScroll } from './disable-scroll.js';
import { enableScroll } from './enable-scroll.js';

(function () {
  const header = document?.querySelector('[data-header]');
  const burgers = document?.querySelectorAll('[data-burger]');
  const overlay = document?.querySelector('[data-overlay]');
  const headerContactButton = document?.querySelector('.header__contact-btn');

  burgers.forEach((burger) => {
    burger?.addEventListener('click', (e) => {
      header?.classList.toggle('header--open');

      changeHeaderElementsStyle();

      header?.classList.contains('header--open')
        ? disableScroll()
        : enableScroll();

      burgers.forEach((item) => {
        if (header?.classList.contains('header--open')) {
          item?.setAttribute('data-is-active', true);
          item?.setAttribute('aria-expanded', 'true');
          item?.setAttribute('aria-label', 'Закрыть меню');
        } else {
          item?.setAttribute('data-is-active', false);
          item?.setAttribute('aria-expanded', 'false');
          item?.setAttribute('aria-label', 'Открыть меню');
        }
      });
    });
  });

  function changeHeaderElementsStyle() {
    headerContactButton?.classList.toggle('btn--primary');
    headerContactButton?.classList.toggle('btn--secondary');

    document
      ?.querySelectorAll('.header .social-link.social-link')
      .forEach((item) => {
        item.classList.toggle(`${item.classList[0]}--dark`);
      });
  }

  function handleClose() {
    header.classList.remove('header--open');

    burgers.forEach((burger) => {
      burger?.setAttribute('data-is-active', false);
      burger?.setAttribute('aria-expanded', 'false');
      burger?.setAttribute('aria-label', 'Открыть меню');
    });

    changeHeaderElementsStyle();
    enableScroll();
  }

  overlay?.addEventListener('click', () => {
    handleClose();
  });
})();
