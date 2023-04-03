'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const modal = document.querySelector('.modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const section4 = document.querySelector('.section--sign-up');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/**
 * @smooth_scrolling
 */
btnScrollTo.addEventListener('click', e => {
  const coordSection1 = section1.getBoundingClientRect(); //current coordinates of the element;
  const currentScrollX = window.scrollX; //current amount of x scrolled
  const currentScrollY = window.scrollY; //current amount of y scrolled
  //Scroll

  // 1.
  // window.scrollTo(
  //   coordSection1.left + currentScrollX,
  //   coordSection1.top + currentScrollY
  // ); //scrool to the given value from the top of document
  // 2.
  window.scrollBy({
    top: coordSection1.top,
    left: coordSection1.left,
    behavior: 'smooth',
  });
  // 3.
  // section1.scrollIntoView({ behavior: 'smooth' });
});

/**
 * @page_navigation
 */

//not efficient as same handler is being attached to many elements
// document.querySelectorAll('.nav__link').forEach(element => {
//   element.addEventListener('click', function (e) {
//     //prevets the default behaviour of anchor
//     e.preventDefault();
//     //selects the target section
//     const targetSection = document.querySelector(this.getAttribute('href'));
//     //scroll to the target section
//     targetSection.scrollIntoView({ behavior: 'smooth' });
//   });
// });

//using event delegation
// 1. Adding event listener to a common parent
// 2. Reading the target of the event
// 3. Matching with the desired target
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matchiing
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/**
 * @tabbed_content
 */

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const btn = e.target.closest('.operations__tab');

  //guard clause
  if (!btn) return;

  //removing the active tabs and content
  document
    .querySelector('.operations__tab--active')
    .classList.toggle('operations__tab--active');
  document
    .querySelector('.operations__content--active')
    .classList.toggle('operations__content--active');

  //making the selected tab active;
  btn.classList.add('operations__tab--active');

  // making the content active
  const activeIndex = btn.dataset.tab - 1;
  tabContent[activeIndex].classList.add('operations__content--active');
});

/**
 * @menu_fade_animation
 */
const nav = document.querySelector('.nav');
const menuFadeHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //changing the opacity of all the siblings and logo
    [...siblings, logo].forEach(el => el != link && (el.style.opacity = this));
  }
};
//binds the this keyword to 'agrument' and e is automatically passed by the event handler
nav.addEventListener('mouseover', menuFadeHandler.bind(0.5));
nav.addEventListener('mouseout', menuFadeHandler.bind(1));

/**
 * @sticky_navbar
 */
// const coordSection1 = section1.getBoundingClientRect().top;
// console.log(coordSection1);
// console.log(section1.getBoundingClientRect());
// window.addEventListener('scroll', function (e) {
//   if (this.scrollY > coordSection1) {
//     nav.classList.add('sticky');
//     console.log(coordSection1);
//   } else nav.classList.remove('sticky');
// });

// using intersection observer API
// always gets called at the starting of the page
const observerHandler = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) nav.classList.remove('sticky');
    else nav.classList.add('sticky');
  });
};
const headerObserverOptions = {
  root: null,
  threshold: 0, //threshold 0 so the nav should become visible as soon as is header cpmpletely gets out of viewport
  rootMargin: `-${nav.getBoundingClientRect().height}px`, //makes viewport end early, so threshold is reached early
};
const headerObserver = new IntersectionObserver(
  observerHandler,
  headerObserverOptions
);
const header = document.querySelector('.header');
headerObserver.observe(header);

/**
 * @disappearing_sections
 */
//implemented using the intersection observer API
const sectionObserverHandler = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    sectionObserver.unobserve(entry.target);
  });
};

const sectionObserverOptions = {
  root: null,
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
};
const sectionObserver = new IntersectionObserver(
  sectionObserverHandler,
  sectionObserverOptions
);
const sections = document.querySelectorAll('.section');
sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/**
 * @lazy_loading_images
 */
const lazyLoader = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  const image = entry.target;
  image.src = image.dataset.src;
  image.addEventListener('load', () => image.classList.remove('lazy-img'));
  imageObserver.unobserve(image);
};
const lazyOptions = {
  root: null,
  threshold: 0,
  rootMargin: '100px', //makes the viewport larger (includes elements 100px beyond the viewport)
};
const imageObserver = new IntersectionObserver(lazyLoader, lazyOptions);
const lazyImages = document.querySelectorAll('.lazy-img');
lazyImages.forEach(lazyImage => imageObserver.observe(lazyImage));

/**
 * @implementing_slider
 */
const sliderComponent = () => {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const maxSlide = slides.length - 1;
  const gotoSlide = s => {
    //go to slide s
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - s)}%)`;
    });
    //activate the dot of s
    const allDots = document.querySelectorAll('.dots__dot');
    allDots.forEach(dot => dot.classList.remove('dots__dot--active'));
    allDots[s].classList.add('dots__dot--active');
  };
  const dotsContainer = document.querySelector('.dots');
  const addDots = () =>
    slides.forEach((_, i) =>
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    );
  //initial condition
  let currSlide = 0;
  addDots();
  gotoSlide(currSlide);

  // sliding with buttons
  const gotoLeft = () => {
    if (currSlide == 0) {
      currSlide = maxSlide;
    } else currSlide--;
    gotoSlide(currSlide);
  };
  const gotoRight = () => {
    if (currSlide == maxSlide) {
      currSlide = 0;
    } else currSlide++;
    gotoSlide(currSlide);
  };
  btnLeft.addEventListener('click', gotoLeft);
  btnRight.addEventListener('click', gotoRight);

  //sliding with keyboard keys
  //using intersection observer api
  function keyHandler(e) {
    if (e.key === 'ArrowRight') gotoRight();
    if (e.key === 'ArrowLeft') gotoLeft();
  }
  const sliderCB = (entries, observer) => {
    if (!entries[0].isIntersecting) {
      document.removeEventListener('keyup', keyHandler);
    } else {
      document.addEventListener('keyup', keyHandler);
    }
  };
  const sliderObserver = new IntersectionObserver(sliderCB, {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  });
  sliderObserver.observe(slider);

  //sliding with dots
  //using event delegation
  dotsContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    gotoSlide(e.target.dataset.slide);
  });
};
sliderComponent();
////////////////////////////////////////////
////////////////////////////////////////////
//////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
//Practice

/**
 * @selecting_adding_removing
 * element from the DOM
 */

// console.log(document.documentElement);
// console.log(document.body);

// //selecting elements
// console.log(document.querySelectorAll('.btn'));
// console.log(document.getElementsByTagName('button'));
// console.log(document.getElementsByClassName('btn'));
// const header = document.querySelector('.header');
// //inserting elements
// // document
// //   .querySelector('.header')
// //   .insertAdjacentHTML('afterend', '<button>Click Me!</button>');

// //create and insert
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved user experience and analytics <button class="btn btn--close-cookie">Got it!</button>';

// // header.after(message); // an element can only be at one place at at time
// header.before(message);
// message.children[0].addEventListener('click', () => {
//   // message.parentElement.removeChild(message);  //old method
//   message.remove();
// });

// //copying an element
// const msgtwo = message.cloneNode(true);
// console.log(msgtwo);
// header.prepend(message);
// header.append(msgtwo);

/**
 * @styling_elements
 */

// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved user experience and analytics <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);

// //applying inline style to an element
// message.style.backgroundColor = '#37383b';
// message.style.width = '120%';

// //getting style value of any element
// console.log(Number.parseFloat(getComputedStyle(message).height));

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 20 + 'px';

// //accessing the variable/ custom property stored in the root
// console.log(
//   document.documentElement.style.setProperty('--color-primary', 'orangered')
// );

// //attributes
// //we can directly access the standard attributes by using the dot operator on any node
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src); //actual path
// console.log(logo.getAttribute('src')); //relative path
// console.log(logo.hello); //only works for standard attributes
// console.log(logo.getAttribute('hello')); //use this to access user-specified attributes
// logo.hello = 'someone'; //does not work hello is not a property of any the node 'logo'
// logo.setAttribute('hello', 'someone');
// console.log(logo.className); //className insted of class

// //setting data properties
// //used to store data in UI
// logo.setAttribute('data-value-stored', '10');
// console.log(logo.dataset.valueStored);

// //setting class name
// console.log(logo.classList);
// logo.classList.add('a', 'b');
// logo.classList.remove('a');
// logo.classList.toggle('b');
// console.log(logo.classList.contains('b'));

/**
 * @handling_events
 */
// const h1 = document.querySelector('h1');
// const h1Handler = () => {
//   console.log('Mouse Moved');
//   h1.removeEventListener('mousemove', h1Handler);
// };
// h1.addEventListener('mousemove', h1Handler);
// // h1.onmousemove = h1Handler;

// // setTimeout(() => h1.removeEventListener('mousemove', h1Handler), 3000);

// /**
//  * @event_bubbling
//  * an event is always created at the window object
//  * it then travel to the event target during the capturing phase
//  * after reaching the target it return back to the window,
//  * passing through the ancestors of the target in the bubbling phase
//  * So, the event can be handeled during any stage by any of the ancestor
//  * The event will pass through the ancestor even if they do not handle it.
//  * Event will reach the target even if the target do not handle it
//  * By default events are handled in the bubbling phase
//  * And their propogation can be stopped
//  */

// const navLink = document.querySelector('.nav__link');
// const navItems = document.querySelector('.nav__links');
// const navbar = document.querySelector('.nav');

// navLink.href = '#';
// const randomInt = (start, end) =>
//   Math.floor(Math.random() * (end - start + 1) + start);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor());
//handling the events
// navLink.addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   // e.stopPropagation();
// });

// navItems.addEventListener('click', function (e) {
//   console.log(e.target);
//   this.style.backgroundColor = randomColor();
// });

// navbar.addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

/**
 * @dom_traversing
 */

//seleting the child nodes

// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('span')); //all the children
// //direnct childrens
// console.log(h1.childNodes); //return iterable all the child nodes
// console.log(h1.children); //return iterable with all the child element

// [...h1.querySelectorAll('span')].forEach(el => {
//   el.style.color = 'orangered';
// });

// //selection parents

// //direct parent
// console.log(h1.parentElement);
// console.log(h1.parentNode);
// // console.log(document.documentElement.parentNode);

// //closest parent
// console.log(h1.closest('header'));
// console.log(h1.parentElement.parentElement);

// //selecting siblings

// console.log(h1.previousSibling);
// console.log(h1.previousElementSibling);
// console.log(h1.nextSibling);
// console.log(h1.nextElementSibling);
// //all the siblings
// console.log(h1.parentElement.children);
