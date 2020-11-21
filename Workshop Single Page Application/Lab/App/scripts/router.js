const router = (path) => {
    const routes = {
        '/home': 'home-template',
        '/login': 'login-form-template',
        '/register': 'register-form-template',
        '/movies': 'movies-template',
    };

    switch (path) {
        case '/logout':
            authService.logOut();
            navigate('/home');
            return;
    }

    const authData = authService.getData();
    const rootDivElement = document.getElementById('root');
    const template = Handlebars.compile(document.getElementById(routes[path]).innerHTML);
    rootDivElement.innerHTML = template(authData);
};

