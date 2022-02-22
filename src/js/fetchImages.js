
const axios = require('axios').default;
let pageOfGallery = 1;


export async function fetchImages(img) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '25750011-0c266cf4868bc30a89bc7fb80';
    const PER_PAGE = 40;
    const options = `image_type=photo&orientation=horizontal&safesearch=true&page=${pageOfGallery}&per_page=${PER_PAGE}`;

    console.log(`pageGallery ${pageOfGallery++}`);

    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${img}&${options}`);
    
    return response.data;

}
