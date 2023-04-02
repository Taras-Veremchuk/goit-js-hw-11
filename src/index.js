import { refs } from './js/refs';
import { onSearchFormSubmit, onLoadMoreBtnClick } from './js/hendlers';

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadeMoreBtn.addEventListener('click', onLoadMoreBtnClick);
