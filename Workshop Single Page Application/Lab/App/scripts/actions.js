attachEvents() {
    const navigationTemplate = Handlebars.compile(document.getElementById('navigation-template').innerHTML);
    Handlebars.registerPartial('navigation-template', navigationTemplate);
    navigate('/home'); 
}

attachEvents();

function navigationHandler(e) {
    e.preventDefault();

    if (e.target.tagName !== 'A' || !e.target.href) return;
    
    const url = new URL(e.target.href);
    navigate(url.pathname);
}

function onRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['register-form']);
    const email = formData.get('email');
    const password = formData.get('password');
    authService.register(email, password);
}

function onLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['login-form']);
    const email = formData.get('email');
    const password = formData.get('password');
    authService.login(email, password)
        .then(data => {
            navigate('/home');
        });
}

function navigate(path) {
    history.pushState({}, '', path);
    router(path);
}