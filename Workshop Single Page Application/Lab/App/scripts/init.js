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

window.addEventListener('popstate', (e) => {
    navigate(location.pathname);
});

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
            navigate('/home');
            displaySuccessNotification('Successful registration!');
        })
        .catch(error => {
            let errorMessage = error.message
                .replace(new RegExp(/_/g), ' ')
                .split(' ')
                .map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
                .join(' ');
            displayErrorNotification(`${errorMessage}.`)
        });
}

function onLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['login-form']);
    const email = formData.get('email');
    const password = formData.get('password');
    authService.login(email, password)
        .then(data => {
            navigate('/home');
            displaySuccessNotification('Login successful.');
        })
        .catch(error => {
            let errorMessage = error.message
                .replace(new RegExp(/_/g), ' ')
                .split(' ')
                .map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
                .join(' ');
            displayErrorNotification(`${errorMessage}.`)
        });
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
        peopleLiked: [""], // check
    })
        .then(res => {
            displaySuccessNotification('Created successfully!');
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
            navigate(`/details/${movieId}`);
            displaySuccessNotification('Eddited successfully.');
        })
        .catch(error => displayErrorNotification(error.message));
}

async function onSearchMovieSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['searchForm']);
    const searchedItem = formData.get('searchedItem').trim();

    const allMovies = await movieService.getAll();
    allMovies.forEach(movie => {
        if (movie.title === searchedItem) {
            navigate(`/details/${movie.movieId}`);
            return;
        }
    })
}

async function likeMovie(e, movieId) {
    let currentUser = JSON.parse(localStorage.getItem('auth')).email;
    let { peopleLiked } = await movieService.getMovie(movieId);

    if (peopleLiked.includes('')) {
        peopleLiked.splice(peopleLiked.indexOf(''), 1);
    }
    peopleLiked.push(currentUser);

    await movieService.likeMovie(movieId, { peopleLiked })
        .then(res => {
            navigate(`/details/${movieId}`);
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
    }, 1000);
}

function displayErrorNotification(message) {
    const errorBoxParagraphElem = document.getElementById('errorBox');
    const errorBoxSectionElem = errorBoxParagraphElem.parentElement;

    errorBoxParagraphElem.innerHTML = message;
    errorBoxSectionElem.style.display = 'block';

    setTimeout(() => {
        errorBoxSectionElem.style.display = 'none';
    }, 1000);
}

function navigate(path) {
    history.pushState({}, '', path);
    router(path);
}