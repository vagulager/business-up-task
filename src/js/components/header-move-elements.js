import { moveElementOnResize } from '../functions/move-element-on-resize.js';

const rating = moveElementOnResize({
  elementSelector: '.header .rating',
  desktopContainer: '.header__rating',
  mobileContainer: '.hero__rating',
  breakpoint: 1199,
});

const headerContacts = moveElementOnResize({
  elementSelector: '.header__connect',
  desktopContainer: '.header__info-col.header__info-col--right',
  mobileContainer: '.header__menu-col.header__menu-col--contacts',
  breakpoint: 1199,
});

document.querySelectorAll('.header .tabs__panel').forEach((item, index) => {
  if (item) {
    const navItem = item
      .closest('.tabs')
      .querySelector(`.tabs__nav-item:nth-child(${index + 1})`);

    moveElementOnResize({
      elementSelector: item,
      desktopContainer: item.closest('.tabs .tabs__content'),
      mobileContainer: navItem,
      breakpoint: 768,
      throttleDelay: 100,
      callback: (isMobile) => {
        const id = isMobile ? 'mark-arrow' : 'arrow';
        const svgUse = navItem.querySelector('.btn__arrow svg use');

        if (svgUse) {
          svgUse.setAttribute(
            'href',
            svgUse.getAttribute('href').replace(/#.*$/, '#' + id)
          );
        }
      },
    });
  }
});
