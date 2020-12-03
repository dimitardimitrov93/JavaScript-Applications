const apiKey = 'AIzaSyDGkmzuD7V6g4iOOrje_Tu1jrIBez82t7o';
const databaseUrl = 'https://softterest-spa-js-default-rtdb.europe-west1.firebasedatabase.app/';

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

const recipeService = {
    //?auth=${authService.getData().idToken}
    //".write": "auth !== null",
    async addRecipe(recipeData) {
        const res = await request(`${databaseUrl}/recipes.json?auth=${authService.getData().idToken}`, 'POST', JSON.stringify(recipeData));
        return res;
    },

    async getAll() {
        const res = await request(`${databaseUrl}/recipes.json`, 'GET');
        return Object.keys(res).map(recipeId => ({ recipeId: recipeId, ...res[recipeId] })); 
    },

    async getRecipe(recipeId) {
        const res = await request(`${databaseUrl}/recipes/${recipeId}.json?auth=${authService.getData().idToken}`, 'GET');
        return res;
    },

    async deleteRecipe(recipeId) {
        const res = await request(`${databaseUrl}/recipes/${recipeId}.json?auth=${authService.getData().idToken}`, 'DELETE');

        if (!res.error) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res.error);
        }
    },

    async editRecipe(recipeId, recipeData) {
        const res = await request(`${databaseUrl}/recipes/${recipeId}.json?auth=${authService.getData().idToken}`, 'PATCH', JSON.stringify(recipeData));
        
        if (!res.error) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res.error);
        }
    },

    async likeRecipe(recipeId, peopleLiked) {
        const res = await request(`${databaseUrl}/recipes/${productId}.json`, 'PATCH', JSON.stringify(peopleLiked));
        return res;
    },
}