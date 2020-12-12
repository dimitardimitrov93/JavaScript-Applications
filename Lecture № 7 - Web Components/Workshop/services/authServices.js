import { Router } from 'https://unpkg.com/@vaadin/router';

const apiKey = 'AIzaSyARQOZyCb3EcyM6F4dHDq4cwvsON1xXD7s';

const api = {
    register: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    login: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
}

export const register = async (email, password) => {
    const res = await fetch(api.register, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
        })
    });

    const data = await res.json();

    if (!data.error) {
        return Promise.resolve(data);
    } else {
        return Promise.reject(data.error);
    }
}

export const login = async (email, password) => {
    const res = await fetch(api.login, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
        })
    });

    const data = await res.json();

    if (!data.error) {
        localStorage.setItem('auth', JSON.stringify(data));
        return Promise.resolve(data);
    } else {
        return Promise.reject(data.error);
    }
}

export const getUserData = () => {
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
}

export const logOut = () => {
    localStorage.removeItem('auth');
}
