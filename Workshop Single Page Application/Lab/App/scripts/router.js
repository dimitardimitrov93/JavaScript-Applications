const router = async (fullPath) => {
    const routes = {
        '/home': 'home-template',
        '/login': 'login-form-template',
        '/register': 'register-form-template',
        '/movies': 'movies-template',
        '/addMovie': 'addMovie-form-template',
        '/details': 'movie-details-template',
        '/edit': 'edit-movie-template',
    };

    let path = fullPath;
    let movieId = '';

    const possiblePathsWithMovieId = /^\/edit|^\/delete|\/details|\/like/;

    if (possiblePathsWithMovieId.test(fullPath)) {
        path = fullPath.slice(0, fullPath.lastIndexOf('/'));
        movieId = fullPath.slice((fullPath.lastIndexOf('/') + 1));
    }

    let authData = authService.getData();
    let templateData = authData;
    let templateId = routes[path];
    let currentUser;

    switch (path) {
        case '/logout':
            authService.logOut();
            navigate('/home');
            return;
        case '/home':
            templateData.movies = await movieService.getAll();
            break;
        case '/details':
            currentUser = JSON.parse(localStorage.getItem('auth')).email;
            templateData.movieData = await movieService.getMovie(movieId);
            const movieCreator = templateData.movieData.creator;
            const userHaventLikedMovieYet = !templateData.movieData.peopleLiked.includes(currentUser);
            const movieLikes = templateData.movieData.peopleLiked.includes('') ? templateData.movieData.peopleLiked.length - 1 : templateData.movieData.peopleLiked.length;
            templateData.movieData.movieLikes = movieLikes;
            templateData.movieData.movieId = movieId;
            templateData.movieData.userHaventLikedMovieYet = userHaventLikedMovieYet;
            templateData.movieData.isCurrentUserCreator = currentUser === movieCreator;
            break;
        case '/delete':
            if (!window.confirm('Are you sure you want to delete this movie?')) return;
            await movieService.deleteMovie(movieId)
                .then(res => {
                    displaySuccessNotification('Movie deleted successfully.');
                    navigate(`/home`);
                })
                .catch(error => displayErrorNotification(error.message));
            return;
        case '/edit':
            templateData.movieData = await movieService.getMovie(movieId);
            break;
        // case '/like':
        //     currentUser = JSON.parse(localStorage.getItem('auth')).email;
        //     templateData.movieData = await movieService.getMovie(movieId);
        //     let peopleLiked = templateData.movieData.peopleLiked;
        //     if (peopleLiked.includes('')) {
        //         peopleLiked.splice(peopleLiked.indexOf(''), 1);
        //     }
        //     peopleLiked.push(currentUser);

        //     await movieService.likeMovie(movieId, { peopleLiked })
        //         .then(res => {
        //             navigate(`/details/${movieId}`);
        //         })
        //         .catch(error => displayErrorNotification(error.message));
        //     return;
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

