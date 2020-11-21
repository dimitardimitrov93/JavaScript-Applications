const apiKey = 'AIzaSyARQOZyCb3EcyM6F4dHDq4cwvsON1xXD7s';

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

        const userData = await res.json();
        localStorage.setItem('auth', JSON.stringify(userData));

        return userData;
    },

    async register(email, password) {
        fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(res => res.json())
            .then(data => console.log(data));
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
    }
};