const router = async (fullPath) => {
    const routes = {
        '/': 'home-template',
        '/home': 'home-template',
        '/login': 'login-form-template',
        '/register': 'register-form-template',
        '/createPost': 'createPost-form-template',
        '/details': 'post-details-template',
        '/edit': 'edit-post-template',
    };

    let path = fullPath;
    let postId = '';

    const possiblePathsWithpostId = /^\/edit|^\/delete|\/details|\/like/;

    if (possiblePathsWithpostId.test(fullPath)) {
        path = fullPath.slice(0, fullPath.lastIndexOf('/'));
        postId = fullPath.slice((fullPath.lastIndexOf('/') + 1));
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
            templateData.posts = await postService.getAll();
            if (!localStorage.getItem('auth')) break;
            currentUser = JSON.parse(localStorage.getItem('auth')).email;
            templateData.posts.forEach(post => {
                if (post.creator === currentUser) {
                    post.isCurrentUserCreator = true;
                } else {
                    post.isCurrentUserCreator = false;
                }
            });
            break;
        case '/details':
            currentUser = JSON.parse(localStorage.getItem('auth')).email;
            templateData.postData = await postService.getPost(postId);
            const productCreator = templateData.postData.creator;
            templateData.postData.postId = postId;
            templateData.postData.isCurrentUserCreator = currentUser === productCreator;
            break;
        case '/delete':
            if (!window.confirm('Are you sure you want to delete this post?')) return;

            await postService.deletePost(postId)
                .then(res => {
                    displaySuccessNotification('Post deleted successfully.');
                    navigate(`/home`);
                })
                .catch(error => displayErrorNotification(error.message));
            return;
        case '/edit':
            templateData.posts = await postService.getAll();
            templateData.postData = await postService.getPost(postId);
            break;
        default:
            break;
    }

    const rootDivElement = document.getElementById('root');
    const template = Handlebars.compile(document.getElementById(templateId).innerHTML);
    rootDivElement.innerHTML = template(templateData);
};

