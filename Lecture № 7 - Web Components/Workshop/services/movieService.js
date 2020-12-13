import { request } from './request.js';
import { getUserData } from './authServices.js';

const databaseUrl = 'https://movies-spa-js.firebaseio.com';
const api = {
    movies: `${databaseUrl}/movies.json?auth=${getUserData().idToken}`,
}

export const getAllMovies = async () => {
    const res = await request(api.movies, 'GET');
    return Object.keys(res).map(movieId => ({ movieId, ...res[movieId] }));
}

export const getMovie = async (movieId) => {
    const res = await request(`${databaseUrl}/movies/${movieId}.json?auth=${getUserData().idToken}`, 'GET');
    return res;
}

export const likeMovie = async (movieId, peopleLiked) => {
    const res = await request(`${databaseUrl}/movies/${movieId}.json?auth=${getUserData().idToken}`, 'PATCH', JSON.stringify(peopleLiked));
    return res;
}