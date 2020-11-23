function attachEvents() {
    const navigationTemplate = Handlebars.compile(document.getElementById('navigation-template').innerHTML);
    const movieCardTemplate = Handlebars.compile(document.getElementById('movie-card-template').innerHTML);
    const editMovieTemplate = Handlebars.compile(document.getElementById('edit-movie-template').innerHTML);

    
    Handlebars.registerPartial('navigation-template', navigationTemplate);
    Handlebars.registerPartial('movie-card-template', movieCardTemplate);
    Handlebars.registerPartial('edit-movie-template', editMovieTemplate);

    navigate('/home');
}

attachEvents();

function navigationHandler(e) {
    e.preventDefault();

        if (e.target.tagName === 'A' && e.target.href) {
            const url = new URL(e.target.href);
            navigate(url.pathname);
        } else if (e.target.tagName === 'BUTTON') {
            const url = new URL(e.target.parentElement.href);
            navigate(url.pathname);
        }

}

function onRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['register-form']);
    const email = formData.get('email');
    const password = formData.get('password');
    const repeatedPassword = formData.get('repeatPassword');

    if (!email.trim()) {
        displayErrorNotification('The email input must be filled.');
        return;
    } else if (password !== repeatedPassword) {
        displayErrorNotification('Password mismatch.');
        return;
    } else if (password.length < 6) {
        displayErrorNotification('The password should be at least 6 characters long.');
        return;
    }

    authService.register(email, password)
        .then(data => {
            displaySuccessNotification('You were registered successfully.');
            navigate('/home');
        })
        .catch(error => displayErrorNotification(error.message));
}

function onLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['login-form']);
    const email = formData.get('email');
    const password = formData.get('password');
    authService.login(email, password)
        .then(data => {
            displaySuccessNotification('Logged in successfully.');
            navigate('/home');
        })
        .catch(error => displayErrorNotification(error.message));
}

function onAddMovieSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['addMovie-form']);
    const title = formData.get('title');
    const description = formData.get('description');
    const imageUrl = formData.get('imageUrl');
    const creator = JSON.parse(localStorage.getItem('auth')).email;

    if (!title.trim() || !description.trim() || !imageUrl.trim()) {
        displayErrorNotification('Invalid inputs!');
        return;
    }

    movieService.add({
        title,
        description,
        imageUrl,
        creator,
        peopleLiked: [], // check
    })
        .then(res => {
            displaySuccessNotification('Movie added successfully');
            navigate('/home');
        })
        .catch(error => displayErrorNotification(error.message));
}

function onEditMovieSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['editMovieForm']);

    const movieData = {
        title: formData.get('title'),
        imageUrl: formData.get('imageUrl'),
        description: formData.get('description'),
    }

    const movieId = location.href.replace(new RegExp(/.*\//), '');

    if (!movieData.title.trim() || !movieData.description.trim() || !movieData.imageUrl.trim()) {
        displayErrorNotification('Invalid inputs!');
        return;
    }

    movieService.editMovie(movieId, movieData)
        .then(res => {
            displaySuccessNotification('Movie edited successfully');
            navigate('/home');
        })
        .catch(error => displayErrorNotification(error.message));
}

function displaySuccessNotification(message) {
    const successBoxParagraphElem = document.getElementById('successBox');
    const successBoxSectionElem = successBoxParagraphElem.parentElement;

    successBoxParagraphElem.innerHTML = message;
    successBoxSectionElem.style.display = 'block';

    setTimeout(() => {
        successBoxSectionElem.style.display = 'none';
    }, 2500);
}

function displayErrorNotification(message) {
    const errorBoxParagraphElem = document.getElementById('errorBox');
    const errorBoxSectionElem = errorBoxParagraphElem.parentElement;

    errorBoxParagraphElem.innerHTML = message;
    errorBoxSectionElem.style.display = 'block';

    setTimeout(() => {
        errorBoxSectionElem.style.display = 'none';
    }, 2500);
}

function navigate(path) {
    history.pushState({}, '', path);
    router(path);
}