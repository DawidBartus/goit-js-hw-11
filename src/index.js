const form = document.querySelector('.search-form');

const { log } = console;

log(form);
const createGaleryElement = elem => {};

const letItHappen = e => {
  e.preventDefault();

  console.log(e.target);
};

form.addEventListener('submit', letItHappen);
