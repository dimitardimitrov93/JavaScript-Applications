const apiKey = 'AIzaSyB3U20o2ZPw-QuvNT6bKKHrnUB0ykizQS8';
const databaseUrl = 'https://shoe-shelf-spa-js.firebaseio.com';

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

const productService = {

    async add(productData) {
        const res = await request(`${databaseUrl}/shoes.json`, 'POST', JSON.stringify(productData));
        return res;
    },

    async getAll() {
        const res = await request(`${databaseUrl}/shoes.json`, 'GET');
        return Object.keys(res).map(productId => ({ productId: productId, ...res[productId] }));
    },

    async getProduct(productId) {
        const res = await request(`${databaseUrl}/shoes/${productId}.json`, 'GET');
        return res;
    },

    async deleteProduct(productId) {
        const res = await request(`${databaseUrl}/shoes/${productId}.json`, 'DELETE');
        return res;
    },

    async editProduct(productId, productData) {
        const res = await request(`${databaseUrl}/shoes/${productId}.json`, 'PATCH', JSON.stringify(productData));
        return res;
    },

    async buyProduct(productId, peopleBought) {
        const res = await request(`${databaseUrl}/shoes/${productId}.json`, 'PATCH', JSON.stringify(peopleBought));
        return res;
    }
}