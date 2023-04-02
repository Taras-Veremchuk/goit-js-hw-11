import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, page, perPage) {
  if (!searchQuery) {
    return;
  }
  try {
    const { data } = await axios(
      `?key=34864361-70a0af8bc93c899dccf6f4508&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}
