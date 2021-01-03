import authService from './services/authService.js';

export const onLoginSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    authService.login(email, password)
        .then(res => {
            console.log(res);
            console.log('logged in');
            
        })
}