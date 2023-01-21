import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const formValue = document.querySelector('[type="text"]');
const gallery = document.querySelector('.gallery');

const { log } = console;
// log(formValue);

const letItHappen = e => {
  e.preventDefault();
  let searchingText = formValue.value;

  if (searchingText) {
    let link = `https://pixabay.com/api/?key=14551273-a2f87cd1c4bb2f6c327ac1a47&q=${searchingText}&image_type=photo`;

    fetchImage(link).then(res => createHTMLElem(res));
  } else {
    Notiflix.Notify.info('Wygląda na to, że nic nie wpisałeś');
  }
};

const fetchImage = link => {
  return fetch(link).then(res => {
    if (!res.ok) {
      throw new Error(response.status);
    } else {
      log('fetch res', res);
      return res.json();
    }
  });
};

// Create and insert images to DOM
const createHTMLElem = res => {
  gallery.innerHTML = '';
  if (res.totalHits > 1 && res.totalHits > 20) {
    addElementsToDOM(res);
    Notiflix.Notify.info(`Znalazłem ${res.total} obrazków`);
  } else if (res.totalHits > 1 && res.totalHits < 20) {
    addElementsToDOM(res);
    Notiflix.Notify.info(
      `Wygląda na to, że znalazłem tylko ${res.total}. Jest tylko jedna strona`
    );
  } else {
    Notiflix.Notify.info('Czego szuaksz?');
  }
};

const addElementsToDOM = res => {
  log(res);
  let img = res.hits
    .map(elem => {
      let page = elem.webformatURL;
      let tags = elem.tags;
      let likes = elem.likes;
      let views = elem.views;
      let comments = elem.comments;
      let downloads = elem.downloads;

      let newImage = `<div class="photo-card">
  <img src="${page}" alt="${tags}" width="360" height="auto" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes </br>
      ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views </br> 
      ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments </br> 
      ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads </br>
       ${downloads}</b>
    </p>
  </div>
</div>`;
      return newImage;
    })
    .join('');
  gallery.innerHTML = img;
};

form.addEventListener('submit', letItHappen);
