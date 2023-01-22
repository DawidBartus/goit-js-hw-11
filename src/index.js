import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import _ from 'lodash';
import axios from 'axios';

const form = document.querySelector('.search-form');
const formValue = document.querySelector('[type="text"]');
const gallery = document.querySelector('.gallery');

let page = 1;
let searchingText;
let link;
let maxPage;

const { log } = console;
// log(formValue);

const searchForImages = e => {
  e.preventDefault();
  searchingText = formValue.value;
  page = 1;
  gallery.innerHTML = '';
  window.addEventListener('scroll', newFetch);

  if (searchingText) {
    link = `https://pixabay.com/api/?key=14551273-a2f87cd1c4bb2f6c327ac1a47&q=${searchingText}&safesearch=true&orientation=horizontal&image_type=photo&page=${page}&per_page=40`;

    fetchImage(link).then(res => {
      createHTMLElem(res);
      maxPage = Math.ceil(res.totalHits / 40);
      if (res.total !== 0) {
        Notiflix.Notify.info(`Hooray! We found ${res.total} images.`);
      }
    });
  } else {
    Notiflix.Notify.info('Try typing "dog"');
  }

  return page, searchingText, link;
};

const fetchImage = async link => {
  try {
    const response = await axios.get(link);
    const images = await response.data;

    return images;
  } catch (error) {
    Notiflix.Notify.info(error.message);
  }
};
//   // return fetch(link).then(res => {
//   //   if (!res.ok) {
//   //     throw new Error(response.status);
//   //   } else {
//   //     return res.json(link);
//   //   }
//   // });

//   return axios
//     .get(link)
//     .then(res => {
//       return res.data;
//     })
//     .catch(error => Notiflix.Notify.info(error.message));
// };

const newFetch = _.throttle(() => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage) {
    if (page !== maxPage) {
      page += 1;

      link = `https://pixabay.com/api/?key=14551273-a2f87cd1c4bb2f6c327ac1a47&q=${searchingText}&safesearch=true&orientation=horizontal&image_type=photo&page=${page}&per_page=40`;
      fetchImage(link).then(res => createHTMLElem(res));
      Notiflix.Notify.info(`You are on page ${page}`);
      if (page === maxPage) {
        window.removeEventListener('scroll', newFetch);
      }
    }
  }
}, 500);

// Create and insert images to DOM
const createHTMLElem = res => {
  if (res.totalHits >= 1) {
    addElementsToDOM(res);
    lightbox.refresh();
  } else {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

const addElementsToDOM = res => {
  let img = res.hits
    .map(elem => {
      let minature = elem.webformatURL;
      let bigImage = elem.largeImageURL;
      let tags = elem.tags;
      let likes = elem.likes;
      let views = elem.views;
      let comments = elem.comments;
      let downloads = elem.downloads;

      let newImage = `<div class="photo-card">
  <img src="${minature}" alt="${tags}" href="${bigImage}" class="gallery__link" loading="lazy" />
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
  gallery.innerHTML = gallery.innerHTML + img;
};

let lightbox = new SimpleLightbox('.gallery__link');

form.addEventListener('submit', searchForImages);
