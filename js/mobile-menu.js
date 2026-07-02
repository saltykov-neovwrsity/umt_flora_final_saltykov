const menuBtnRef = document.querySelector('[data-menu-button]');
const mobileMenuRef = document.querySelector('[data-menu]');
const menuLinks = mobileMenuRef.querySelectorAll('a, button');

const toggleMenu = () => {
  const expanded = menuBtnRef.getAttribute('aria-expanded') === 'true' || false;

  menuBtnRef.classList.toggle('is-open');
  menuBtnRef.setAttribute('aria-expanded', !expanded);

  mobileMenuRef.classList.toggle('is-open');
  document.body.classList.toggle('menu-open');
};

menuBtnRef.addEventListener('click', toggleMenu);

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenuRef.classList.contains('is-open')) {
      toggleMenu();
    }
  });
});
