const apiKey = 'AIzaSyARQOZyCb3EcyM6F4dHDq4cwvsON1xXD7s';
const databaseUrl = 'https://movies-spa-js.firebaseio.com';

const request = async (url, method, body) => {
    let options = method === 'POST' || method === 'PATCH' ? { method, body } : { method };

    const res = await fetch(url, options);

    const data = await res.json();

    return data;
}

const authService = {

    async login(email, password) {
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await res.json();

        if (!data.error) {
            localStorage.setItem('auth', JSON.stringify(data));
            return Promise.resolve(data);
        } else {
            return Promise.reject(data.error);
        }
    },

    async register(email, password) {
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const data = await res.json();

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
        displaySuccessNotification('Successful logout.');
    },
};

const movieService = {

    async add(movieData) {
        const res = await request(`${databaseUrl}/movies.json`, 'POST', JSON.stringify(movieData));
        return res;
    },

    async getAll() {
        const res = await request(`${databaseUrl}/movies.json`, 'GET');
        return Object.keys(res).map(movieId => ({ movieId, ...res[movieId] }));
    },

    async getMovie(movieId) {
        const res = await request(`${databaseUrl}/movies/${movieId}.json`, 'GET');
        return res;
    },

    async deleteMovie(movieId) {
        const res = await request(`${databaseUrl}/movies/${movieId}.json`, 'DELETE');
        return res;
    },

    async editMovie(movieId, movieData) {
        const res = await request(`${databaseUrl}/movies/${movieId}.json`, 'PATCH', JSON.stringify(movieData));
        return res;
    },

    async likeMovie(movieId, peopleLiked) {
        const res = await request(`${databaseUrl}/movies/${movieId}.json`, 'PATCH', JSON.stringify(peopleLiked));
        return res;
    }
}