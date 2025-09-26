import { throttle } from './throttle.js';

const IS_LOG = false;

// Функция для перемещения элемента между контейнерами
export function moveElementOnResize(options) {
  const {
    elementSelector,
    desktopContainer,
    mobileContainer,
    breakpoint = 768,
    throttleDelay = 100,
    callback = () => {},
  } = options;

  const element = elementSelector.nodeName
    ? elementSelector
    : document.querySelector(elementSelector);
  const desktopEl = desktopContainer.nodeName
    ? desktopContainer
    : document.querySelector(desktopContainer);
  const mobileEl = mobileContainer.nodeName
    ? mobileContainer
    : document.querySelector(mobileContainer);

  if (!element || !desktopEl || !mobileEl) {
    console.error('Не найдены элементы для перемещения:', {
      element,
      desktopEl,
      mobileEl,
    });
    return;
  }

  let isMobile = window.innerWidth <= breakpoint;
  let resizeObserver = null;

  function moveElement() {
    const currentIsMobile = window.innerWidth <= breakpoint;

    // Перемещаем только если состояние изменилось
    if (currentIsMobile !== isMobile) {
      const targetContainer = currentIsMobile ? mobileEl : desktopEl;
      const currentContainer = currentIsMobile ? desktopEl : mobileEl;

      IS_LOG &&
        console.log('Перемещение элемента:', {
          from: currentContainer.className || currentContainer.id,
          to: targetContainer.className || targetContainer.id,
          isMobile: currentIsMobile,
          width: window.innerWidth,
        });

      // Проверяем, что элемент еще существует в DOM и не находится уже в целевом контейнере
      if (element.parentNode && element.parentNode !== targetContainer) {
        targetContainer.appendChild(element);
        IS_LOG && console.log('Элемент успешно перемещен');
      } else {
        IS_LOG &&
          console.log('Элемент уже в целевом контейнере или отсутствует в DOM');
      }

      callback(currentIsMobile);

      isMobile = currentIsMobile;
    }
  }

  function handleResize(entries) {
    if (entries && entries.length > 0) {
      // Если используем ResizeObserver для конкретного элемента
      const entry = entries[0];
      const width = entry.contentRect.width;
      const currentIsMobile = width <= breakpoint;

      if (currentIsMobile !== isMobile) {
        const targetContainer = currentIsMobile ? mobileEl : desktopEl;

        if (element.parentNode && element.parentNode !== targetContainer) {
          targetContainer.appendChild(element);

          IS_LOG &&
            console.log('ResizeObserver: Элемент перемещен', {
              width,
              breakpoint,
            });
        }

        callback(currentIsMobile);

        isMobile = currentIsMobile;
      }
    } else {
      // Стандартное поведение для window resize
      moveElement();
    }
  }

  const throttledHandleResize = throttle(handleResize, throttleDelay);

  function init() {
    // Первоначальное размещение элемента
    const targetContainer = isMobile ? mobileEl : desktopEl;

    callback(isMobile);

    // Проверяем, не находится ли элемент уже в правильном контейнере
    if (element.parentNode !== targetContainer) {
      targetContainer.appendChild(element);
      IS_LOG && console.log('Первоначальное размещение элемента');
    }

    // Инициализируем наблюдение
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(throttledHandleResize);

      // Наблюдаем за body или html элементом для отслеживания изменений размера окна
      const observedElement = document.body || document.documentElement;
      resizeObserver.observe(observedElement);

      IS_LOG && console.log('ResizeObserver инициализирован');
    } else {
      // Fallback для старых браузеров
      window.addEventListener('resize', throttledHandleResize);
      IS_LOG && console.log('Используется window.resize (fallback)');
    }
  }

  function destroy() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      IS_LOG && console.log('ResizeObserver отключен');
    } else {
      window.removeEventListener('resize', throttledHandleResize);
      IS_LOG && console.log('Обработчик resize удален');
    }
  }

  // Добавляем метод для принудительного обновления
  function forceUpdate() {
    moveElement();
  }

  init();

  return {
    destroy,
    update: forceUpdate,
    getState: () => ({
      isMobile,
      breakpoint,
      currentWidth: window.innerWidth,
      elementParent: element.parentNode
        ? element.parentNode.className || element.parentNode.id
        : 'none',
    }),
  };
}

// Пример использования с отладкой:
// const ratingMover = moveElementOnResize({
//   elementSelector: '.your-element',
//   desktopContainer: '.desktop-container',
//   mobileContainer: '.mobile-container',
//   breakpoint: 768,
//   throttleDelay: 150,
// });

// console.log('Состояние после инициализации:', ratingMover.getState());
