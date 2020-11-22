const router = async (fullPath) => {
    const routes = {
        '/home': 'home-template',
        '/login': 'login-form-template',
        '/register': 'register-form-template',
        '/movies': 'movies-template',
        '/addMovie': 'addMovie-form-template',
        '/details': 'movie-details-template',
    };

    let path = fullPath;
    let movieId = '';
    if (fullPath.includes('details')) {
        path = fullPath.slice(0, fullPath.lastIndexOf('/'));
        movieId = fullPath.slice(fullPath.lastIndexOf('/'));
    }

    let authData = authService.getData();
    let templateData = authData;
    let templateId = routes[path];

    switch (path) {
        case '/logout':
            authService.logOut();
            navigate('/home');
            return;
        case '/home':
            templateData.movies = await movieService.getAll();
            break;
        case '/details':
            templateData.movieData = await movieService.getMovie(movieId);
            const currentUser = JSON.parse(localStorage.getItem('auth')).email;
            const movieCreator = templateData.movieData.creator;
            templateData.movieData.isCurrentUserCreator = currentUser === movieCreator;
            break;
        default:
            break;
    }

    

    // for (const key in templateData.movies) {
    //     const movieId = key;
    //     templateData.movies[key].movieId = movieId;
    // }

    const rootDivElement = document.getElementById('root');
    const template = Handlebars.compile(document.getElementById(templateId).innerHTML);
    rootDivElement.innerHTML = template(templateData);
};

