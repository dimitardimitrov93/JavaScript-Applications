const router = async (fullPath) => {
    const routes = {
        '/home': 'home-template',
        '/login': 'login-form-template',
        '/register': 'register-form-template',
        '/createOffer': 'createOffer-form-template',
        '/details': 'product-details-template',
        '/edit': 'edit-product-template',
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

            await productService.deleteProduct(productId)
                .then(res => {
                    displaySuccessNotification('Product deleted successfully.');
                    navigate(`/home`);
                })
                .catch(error => displayErrorNotification(error.message));
            return;
        case '/edit':
            templateData.productData = await productService.getProduct(productId);
            break;
        default:
            break;
    }

    const rootDivElement = document.getElementById('root');
    const template = Handlebars.compile(document.getElementById(templateId).innerHTML);
    rootDivElement.innerHTML = template(templateData);
};

