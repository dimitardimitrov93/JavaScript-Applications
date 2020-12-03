const router = async (fullPath) => {
    const routes = {
        '/': 'home-template',
        '/home': 'home-template',
        '/login': 'login-form-template',
        '/register': 'register-form-template',
        '/user-profile': 'user-profile-template',
        '/dashboard': 'dashboard-template',
        '/create-recipe': 'create-recipe-form-template',
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
        case '/dashboard':
            currentUserIdeas = [];
            currentUserIdeasCount = 0;
            templateData.recipes = await recipeService.getAll();
            if (!localStorage.getItem('auth')) break;
            currentUser = JSON.parse(localStorage.getItem('auth')).email;

            templateData.recipes.map(recipe => {
                recipe.isCurrentUserCreator = recipe.creator === currentUser;
                currentUserIdeas.push(recipe);
                currentUserIdeasCount++;
            });

            localStorage.setItem('currentUserIdeas', JSON.stringify(currentUserIdeas));
            localStorage.setItem('currentUserIdeasCount', JSON.stringify(currentUserIdeasCount));
            break;
        case '/details':
            if (!localStorage.getItem('auth')) {
                displayErrorNotification('Unauthorized!');
                navigate('/home');
                return;
            };

            currentUser = JSON.parse(localStorage.getItem('auth')).email;
            templateData.articleData = await recipeService.getArticle(articleId);
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

            await recipeService.deleteArticle(articleId)
                .then(res => {
                    displaySuccessNotification('Article deleted successfully.');
                    navigate(`/home`);
                })
                .catch(error => displayErrorNotification(error));
            return;
        case '/edit':
            templateData.articleData = await recipeService.getArticle(articleId);
            break;
        case '/user-profile':
            templateData.currentUserIdeas = JSON.parse(localStorage.getItem('currentUserIdeas'));
            templateData.currentUserIdeasCount = JSON.parse(localStorage.getItem('currentUserIdeasCount'));
            break;
        default:
            break;
    }

    const rootDivElement = document.getElementById('root');
    const template = Handlebars.compile(document.getElementById(templateId).innerHTML);
    rootDivElement.innerHTML = template(templateData);
};

