const router = async (fullPath) => {
    const routes = {
        '/': 'home-template',
        '/home': 'home-template',
        '/login': 'login-form-template',
        '/register': 'register-form-template',
        '/create-article': 'create-article-form-template',
        '/details': 'article-details-template',
        '/edit': 'edit-article-template',
    };

    let path = fullPath;
    let articleId = '';

    const possiblePathsWithArticleId = /^\/edit|^\/delete|\/details|\/like/;

    if (possiblePathsWithArticleId.test(fullPath)) {
        path = fullPath.slice(0, fullPath.lastIndexOf('/'));
        articleId = fullPath.slice((fullPath.lastIndexOf('/') + 1));
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
        case '/':
            templateData.categories = await articleService.getAll();
            if (!localStorage.getItem('auth')) break;
            currentUser = JSON.parse(localStorage.getItem('auth')).email;

            for (const category in templateData.categories) {
                templateData.categories[category].forEach(article => {
                    article.isAuthenticated = templateData.isAuthenticated;
                    article.isCurrentUserCreator = article.creator === currentUser;
                });
            }

            break;
        case '/details':
            if (!localStorage.getItem('auth')) {
                displayErrorNotification('Unauthorized!');
                navigate('/home');
                return;
            };

            currentUser = JSON.parse(localStorage.getItem('auth')).email;
            templateData.articleData = await articleService.getArticle(articleId);
            const articleCreator = templateData.articleData.creator;
            templateData.articleData.articleId = articleId;
            templateData.articleData.isCurrentUserCreator = currentUser === articleCreator;
            break;
        case '/delete':
            if (!localStorage.getItem('auth')) {
                displayErrorNotification('Unauthorized!');
                navigate('/home');
                return;
            };

            if (!window.confirm('Are you sure you want to delete this article?')) return;

            await articleService.deleteArticle(articleId)
                .then(res => {
                    displaySuccessNotification('Article deleted successfully.');
                    navigate(`/home`);
                })
                .catch(error => displayErrorNotification(error));
            return;
        case '/edit':
            templateData.articleData = await articleService.getArticle(articleId);
            break;
        default:
            break;
    }

    const rootDivElement = document.getElementById('app');
    const template = Handlebars.compile(document.getElementById(templateId).innerHTML);
    rootDivElement.innerHTML = template(templateData);  
};

