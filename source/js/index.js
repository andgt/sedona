'use strict'

const page = document.querySelector('.page__body');
const nav = page.querySelector('.main-nav');
const mainNav = page.querySelector('.main-nav__list');
const buttonNav = page.querySelector('.main-nav__button-toggle');
const range = page.querySelector('.video__range-input');

const isEscapeKey = (evt) => evt.keyCode === 27;
buttonNav.classList.add('main-nav__button-toggle--closed');
buttonNav.classList.remove('main-nav__button-toggle--opened');

const toggleMenu = () => {
  document.addEventListener('keydown', onDocumentKeydown);
  buttonNav.classList.toggle('main-nav__button-toggle--closed');
  buttonNav.classList.toggle('main-nav__button-toggle--opened');
}

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    buttonNav.classList.remove('main-nav__button-toggle--opened');
    buttonNav.classList.add('main-nav__button-toggle--closed');
    document.removeEventListener('keydown', onDocumentKeydown);
  }
}

buttonNav.addEventListener('click', toggleMenu);

if (range) {
  let rangeTrack = range.parentNode.clientWidth;
  if (rangeTrack <= 280) {
    range.value = 16;
  } else if (rangeTrack <= 389) {
    range.value = 30;
  } else if (rangeTrack <= 543) {
    range.value = 21;
  }
}

const reportWindowSize = () => {
  if (rangeTrack <= 236) {
    range.value = 16;
  } else if (rangeTrack <= 389) {
    range.value = 30;
  } else if (rangeTrack <= 543) {
    range.value = 21;
  }
}

if (range) {
    window.addEventListener('resize', reportWindowSize);
}
