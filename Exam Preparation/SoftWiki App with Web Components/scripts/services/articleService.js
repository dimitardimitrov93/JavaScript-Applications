import request from './request.js';
import authService from './authService.js';

const apiKey = 'AIzaSyAw-1ZG6ROEuBoMmGLTi5QmLykhG2ncMRQ';
const databaseUrl = 'https://softwiki-spa-js-default-rtdb.europe-west1.firebasedatabase.app';

export default {
    //?auth=${authService.getData().idToken}
    //".write": "auth !== null",
    async addArticle(articleData) {
        const res = await request.post(`${databaseUrl}/articles.json?auth=${authService.getData().idToken}`, JSON.stringify(articleData));
        return res;
    },

    async getAll() {
        const res = await request.get(`${databaseUrl}/articles.json`);
        const data = Object.keys(res).map(articleId => ({ articleId: articleId, ...res[articleId] }));
        // return await filterData(data);
        return data;
    },

    async getArticle(articleId) {
        const res = await request(`${databaseUrl}/articles/${articleId}.json?auth=${authService.getData().idToken}`, 'GET');
        return res;
    },

    async deleteArticle(articleId) {
        const res = await request(`${databaseUrl}/articles/${articleId}.json?auth=${authService.getData().idToken}`, 'DELETE');

        if (!res.error) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res.error);
        }
    },

    async editArticle(articleId, articleData) {
        const res = await request(`${databaseUrl}/articles/${articleId}.json?auth=${authService.getData().idToken}`, 'PATCH', JSON.stringify(articleData));

        if (!res.error) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res.error);
        }
    },
}