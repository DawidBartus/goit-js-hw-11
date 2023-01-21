const form = document.querySelector('[type="submit"]');

const { log } = console;

log(form);
const createGaleryElement = elem => {};

const letItHappen = e => {
  e.preventDefault();

  console.log(e.target);
};

form.addEventListener('submit', letItHappen);
