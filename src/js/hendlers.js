import { createImagesMarkup } from './create-img-markup';
import { refs } from './refs';
import Notiflix from 'notiflix';
import { fetchImages } from './fetch-images';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let searchQuery = '';
let page = 1;
let perPage = 40;

hideLoadeMoreBtn();

export function onSearchFormSubmit(e) {
  e.preventDefault();
  hideLoadeMoreBtn();
  page = 1;
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  fetchImages(searchQuery, page, perPage)
    .then(response => {
      if (!searchQuery || response.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        hideLoadeMoreBtn();
        clearGalleryContainer();
        return;
      } else {
        Notiflix.Notify.success(
          `Hooray! We found ${response.totalHits} images.`
        );
        showLoadeMoreBtn();
        clearGalleryContainer();
        renderImagesMarkup(response.hits);
      }
    })
    .catch(error => console.log(error));
}

export async function onLoadMoreBtnClick() {
  try {
    page += 1;
    searchQuery = refs.searchForm.searchQuery.value.trim();
    const { hits, totalHits } = await fetchImages(searchQuery, page, perPage);
    renderImagesMarkup(hits);
    if (page > totalHits / perPage) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      hideLoadeMoreBtn();
    }
  } catch (error) {
    console.log(error);
  }
}

function renderImagesMarkup(hits) {
  const imagesMarkup = createImagesMarkup(hits);
  refs.galleryContainer.insertAdjacentHTML('beforeend', imagesMarkup);
}
function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
function hideLoadeMoreBtn() {
  refs.loadeMoreBtn.classList.add('is-hidden');
}
function showLoadeMoreBtn() {
  refs.loadeMoreBtn.classList.remove('is-hidden');
}
