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

export async function onSearchFormSubmit(e) {
  e.preventDefault();
  hideLoadeMoreBtn();
  page = 1;
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (!searchQuery) {
    failryResultInf();
    hideLoadeMoreBtn();
    clearGalleryContainer();
    return;
  }
  try {
    const { hits, totalHits } = await fetchImages(searchQuery, page, perPage);
    if (hits.length < 40) {
      successResultsInf(totalHits);
      endOfResultsInf();
      hideLoadeMoreBtn();
      clearGalleryContainer();
      renderImagesMarkup(hits);
    } else {
      successResultsInf(totalHits);
      showLoadeMoreBtn();
      clearGalleryContainer();
      renderImagesMarkup(hits);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function onLoadMoreBtnClick() {
  try {
    page += 1;
    searchQuery = refs.searchForm.searchQuery.value.trim();
    const { hits, totalHits } = await fetchImages(searchQuery, page, perPage);
    renderImagesMarkup(hits);
    if (page > totalHits / perPage) {
      endOfResultsInf();
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
function endOfResultsInf() {
  setTimeout(() => {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }, 1000);
}
function successResultsInf(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}
function failryResultInf() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
