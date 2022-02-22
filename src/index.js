import './sass/main.scss';
import { fetchImages } from './js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import imageCard from './hbs/imgCard.hbs';

const refs = {
    imageForm: document.querySelector('#search-form'),
    imageInput: document.querySelector('input[name="searchQuery"]'),
    imageGallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

refs.imageForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

refs.loadMoreBtn.hidden = true;
let pageOfGallery = 1;

function resetPage() {
    pageOfGallery = 1;
}

function onFormSubmit(e) {
    e.preventDefault();
    resetPage();
    refs.imageGallery.innerHTML = '';
    fetchImages(refs.imageInput.value)
        .then(renderImages)
        .catch(onFetchError);
    
    refs.loadMoreBtn.hidden = false;
}

function renderImages(images) {
    console.log(images);

    if (!images.total) {
        Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        refs.loadMoreBtn.hidden = true;
        refs.imageGallery.innerHTML = '';
        return;

    } else if (images.total > 1) {
        Notiflix.Notify.info(`Hooray! We found ${images.total} images.`);
        refs.loadMoreBtn.hidden = false;
    }

    if (images.total < 40) {
        refs.loadMoreBtn.hidden = true;
        Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    }

    const markup = [];
    for (let index = 0; index < images.hits.length; index++) {
        const element = images.hits[index];
        markup.push(imageCard(element));
    }
    refs.imageGallery.innerHTML += markup.join('');
    
    let lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
        captionPosition: 'bottom',
    });
    lightbox.refresh();

}

function onLoadMore() {
    refs.loadMoreBtn.hidden = true;

    fetchImages(refs.imageInput.value)
        .then(renderImages)
        .catch(onFetchError);
}

function onFetchError(error) {
    console.log(error);
    Notiflix.Notify.failure(`Sorry, something going wrong`);
    
}