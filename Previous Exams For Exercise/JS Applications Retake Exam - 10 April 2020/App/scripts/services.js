const apiKey = 'AIzaSyBELIt2SslCiJ8RzzpzmJe_L2Nus0R7Wso';
const databaseUrl = 'https://myblog-spa.firebaseio.com';

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
                password,
                returnSecureToken: true, // important
            }),
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
                password,
                returnSecureToken: true,
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
        displaySuccessNotification('Successful logout.');
    },
};

const postService = {
    //?auth=${authService.getData().idToken}
    //".write": "auth !== null",
    async add(postData) {
        const res = await request(`${databaseUrl}/posts.json?auth=${authService.getData().idToken}`, 'POST', JSON.stringify(postData));
        return res;
    },

    async getAll() {
        const res = await request(`${databaseUrl}/posts.json`, 'GET');
        return Object.keys(res).map(postId => ({ postId: postId, ...res[postId] }));
    },

    async getPost(postId) {
        const res = await request(`${databaseUrl}/posts/${postId}.json`, 'GET');
        return res;
    },

    async deletePost(postId) {
        const res = await request(`${databaseUrl}/posts/${postId}.json?auth=${authService.getData().idToken}`, 'DELETE');
        return res;
    },

    async editPost(postId, postData) {
        const res = await request(`${databaseUrl}/posts/${postId}.json?auth=${authService.getData().idToken}`, 'PATCH', JSON.stringify(postData));
        return res;
    },
}