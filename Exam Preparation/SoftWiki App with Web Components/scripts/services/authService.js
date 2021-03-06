import request from './request.js';

const apiKey = 'AIzaSyAw-1ZG6ROEuBoMmGLTi5QmLykhG2ncMRQ';
const baseUrl = 'https://softwiki-spa-js-default-rtdb.europe-west1.firebasedatabase.app';
const endPoints = {
    login: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    register: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
}

export default {

    async login(email, password) {
        const res = request.post(endPoints.login, JSON.stringify({
                email,
                password,
                returnSecureToken: true, // important
            }),
        );
        
        const data = await res;
        console.log(data);
        
        
        if (!data.error) {
            localStorage.setItem('auth', JSON.stringify(data));
            return Promise.resolve(data);
        } else {
            return Promise.reject(data.error);
        }
    },

    async register(email, password) {
        const res = request.post(endPoints.register, JSON.stringify({
                email,
                password,
                returnSecureToken: true,
            })
        )

        const data = await res;

        if (!data.error) {
            return Promise.resolve(data);
        } else {
            return Promise.reject(data.error);
        }
    },

    getData() {
        const data = JSON.parse(localStorage.getItem('auth'));

        if (data) {
            return {
                isAuthenticated: Boolean(data.idToken),
                email: data.email,
                idToken: data.idToken,
            }
        } else {
            return {
                isAuthenticated: false,
                email: '',
            }
        }
    },

    logOut() {
        localStorage.removeItem('auth');
    },
};
