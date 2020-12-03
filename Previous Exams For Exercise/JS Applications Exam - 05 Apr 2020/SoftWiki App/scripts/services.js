const apiKey = 'AIzaSyAw-1ZG6ROEuBoMmGLTi5QmLykhG2ncMRQ';
const databaseUrl = 'https://softwiki-spa-js-default-rtdb.europe-west1.firebasedatabase.app';

const request = async (url, method, body) => {
    let options = method === 'POST' || method === 'PATCH' ? { method, body } : { method };

    const res = await fetch(url, options);
    const data = await res.json();
    
    return data;
}

const filterData = async (data) => {

    let filteredData = {};
    filteredData.jsArticles = data.filter(article => (article.category.toLowerCase().trim() === 'javascript') || (article.category.toLowerCase() === 'js'));
    filteredData.cSharpArticles = data.filter(article => (article.category.toLowerCase().trim() === 'csharp') || (article.category.toLowerCase() === 'c#'));
    filteredData.javaArticles = data.filter(article => article.category.toLowerCase().trim() === 'java');
    filteredData.pythonArticles = data.filter(article => article.category.toLowerCase().trim() === 'python');

    return filteredData;
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

const articleService = {
    //?auth=${authService.getData().idToken}
    //".write": "auth !== null",
    async addArticle(articleData) {
        const res = await request(`${databaseUrl}/articles.json?auth=${authService.getData().idToken}`, 'POST', JSON.stringify(articleData));
        return res;
    },

    async getAll() {
        const res = await request(`${databaseUrl}/articles.json`, 'GET');
        const data = Object.keys(res).map(articleId => ({ articleId: articleId, ...res[articleId] })); 
        return await filterData(data);
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