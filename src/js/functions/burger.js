import { disableScroll } from './disable-scroll.js';
import { enableScroll } from './enable-scroll.js';

const header = document?.querySelector('[data-header]');
const burgers = document?.querySelectorAll('[data-burger]');
const overlay = document?.querySelector('[data-overlay]');
const menu = document?.querySelector('[data-menu]');
const headerContactButton = document?.querySelector('.header__contact-btn');
const main = document.querySelector('main');

burgers.forEach((burger) => {
  burger?.addEventListener('click', () => toggleMenu(!isMenuOpen()));
});

function isMenuOpen() {
  return header?.classList.contains('header--open');
}

function toggleMenu(isOpen) {
  isOpen ? disableScroll() : enableScroll();
  changeHeaderElementsStyle();

  header?.classList.toggle('header--open', isOpen);
  menu?.toggleAttribute('aria-hidden', !isOpen);
  main.toggleAttribute('inert', isOpen);

  burgers.forEach((burger) => {
    burger?.setAttribute('data-is-active', isOpen);
    burger?.setAttribute('aria-expanded', isOpen);
    burger?.setAttribute(
      'aria-label',
      isOpen ? 'Закрыть меню' : 'Открыть меню'
    );
  });
}

function changeHeaderElementsStyle() {
  headerContactButton?.classList.toggle('btn--primary');
  headerContactButton?.classList.toggle('btn--secondary');

  document
    ?.querySelectorAll('.header .social-link.social-link')
    .forEach((item) => {
      item.classList.toggle(`${item.classList[0]}--dark`);
    });
}

overlay?.addEventListener('click', () => {
  toggleMenu(false);
});

document.body.addEventListener('keydown', (e) => {
  if (e.key == 'Escape' && isMenuOpen()) {
    toggleMenu(false);
  }
});
