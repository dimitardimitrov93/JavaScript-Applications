const router = async (fullPath) => {
    const routes = {
        '/home': 'home-template',
        '/login': 'login-form-template',
        '/register': 'register-form-template',
        // '/shoe-shelf': 'shoe-shelf-template',
        '/createOffer': 'createOffer-form-template',
        '/details': 'product-details-template',
        // '/edit': 'edit-movie-template',
    };

    let path = fullPath;
    let productId = '';

    const possiblePathsWithProductId = /^\/edit|^\/delete|\/details|\/like/;

    if (possiblePathsWithProductId.test(fullPath)) {
        path = fullPath.slice(0, fullPath.lastIndexOf('/'));
        productId = fullPath.slice((fullPath.lastIndexOf('/') + 1));
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
            templateData.products = await productService.getAll();
            break;
        case '/details':
            currentUser = JSON.parse(localStorage.getItem('auth')).email;
            templateData.productData = await productService.getProduct(productId);
            const productCreator = templateData.productData.creator;
            const userHaventBoughtProductYet = !templateData.productData.peopleBought.includes(currentUser);
            const peopleBought = templateData.productData.peopleBought.includes('') ? templateData.productData.peopleBought.length - 1 : templateData.productData.peopleBought.length;
            templateData.productData.peopleBought = peopleBought;
            templateData.productData.productId = productId;
            templateData.productData.userHaventBoughtProductYet = userHaventBoughtProductYet;
            templateData.productData.isCurrentUserCreator = currentUser === productCreator;
            break;
        case '/delete':
            if (!window.confirm('Are you sure you want to delete this product?')) return;
            await productService.deleteMovie(productId)
                .then(res => {
                    displaySuccessNotification('Product deleted successfully.');
                    navigate(`/home`);
                })
                .catch(error => displayErrorNotification(error.message));
            return;
        case '/edit':
            templateData.movieData = await productService.getMovie(productId);
            break;
        // case '/like':
        //     currentUser = JSON.parse(localStorage.getItem('auth')).email;
        //     templateData.movieData = await productService.getMovie(movieId);
        //     let peopleBought = templateData.movieData.peopleLiked;
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

