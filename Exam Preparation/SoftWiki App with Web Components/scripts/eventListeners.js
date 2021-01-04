import authService from './services/authService.js';
import articleService from './services/articleService.js';
import router from './router.js';

export const onLoginSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    authService.login(email, password)
        .then(res => {
            console.log(res);
            console.log('logged in');
            router('/');
        })
}

export const onRegisterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const repeatedPassword = formData.get('rep-pass');

    // if (!email.trim()) {
    //     displayErrorNotification('The email input must be filled.');
    //     return;
    // } else if (password !== repeatedPassword) {
    //     displayErrorNotification('Password mismatch.');
    //     return;
    // } else if (password.length < 6) {
    //     displayErrorNotification('The password should be at least 6 characters long.');
    //     return;
    // }

    authService.register(email, password)
        .then(data => {
            // navigate('/home');
            // displaySuccessNotification('Successful registration!');
            console.log(data);
            console.log('Successful registration.');
            router('/');
        })
        .catch(error => {
            let errorMessage = error.message
                .replace(new RegExp(/_/g), ' ')
                .split(' ')
                .map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
                .join(' ');
            console.log(errorMessage);
            // displayErrorNotification(`${errorMessage}.`)
        });
}

export const logOut = () => {
    localStorage.removeItem('auth');
    console.log('Successfully logged out.');
    router('/login');
}

export const onCreatedArticleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const category = formData.get('category');
    const content = formData.get('content');
    const creator = JSON.parse(localStorage.getItem('auth')).email;

    if (!title.trim() || !category.trim() || !content.trim()) {
        // displayErrorNotification('Invalid inputs!');
        return;
    }

    articleService.addArticle({
        title,
        category,
        content,
        creator,
    })
        .then(res => {
            // displaySuccessNotification('Created successfully!');
            console.log('Created successfully!');
            
            router('/');
        })
        .catch(error => {
            console.log(error);
            
            // displayErrorNotification(error.message)
        });
}