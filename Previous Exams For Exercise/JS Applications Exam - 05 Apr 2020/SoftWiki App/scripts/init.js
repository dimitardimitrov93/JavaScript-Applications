function attachEvents() {
    const navigationTemplate = Handlebars.compile(document.getElementById('navigation-template').innerHTML);
    // const postCardTemplate = Handlebars.compile(document.getElementById('article-card-template').innerHTML);

    Handlebars.registerPartial('navigation-template', navigationTemplate);
    // Handlebars.registerPartial('article-card-template', articleCardTemplate);

    navigate(new URL(location.href).pathname);
}

attachEvents();

window.addEventListener('popstate', (e) => {
    router(location.pathname);
});

function navigationHandler(e) {
    e.preventDefault();
    
    if (e.target.tagName === 'A' && e.target.href) {
        const url = new URL(e.target.href);
        navigate(url.pathname);
    }
}

function onRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['register-form']);
    const email = formData.get('email');
    const password = formData.get('password');
    const repeatedPassword = formData.get('rep-pass');

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

function onCreatedArticleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['create-article-form']);
    const title = formData.get('title');
    const category = formData.get('category');
    const content = formData.get('content');
    const creator = JSON.parse(localStorage.getItem('auth')).email;

    if (!title.trim() || !category.trim() || !content.trim()) {
        displayErrorNotification('Invalid inputs!');
        return;
    }

    articleService.addArticle({
        title,
        category,
        content,
        creator,
    })
        .then(res => {
            displaySuccessNotification('Created successfully!');
            navigate('/home');
        })
        .catch(error => displayErrorNotification(error.message));
}

function onEditArticleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['editArticleForm']);

    const articleData = {
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
    }

    const articleId = location.href.replace(new RegExp(/.*\//), '');

    if (!articleData.title.trim() || !articleData.category.trim() || !articleData.content.trim()) {
        displayErrorNotification('Invalid inputs!');
        return;
    }

    articleService.editArticle(articleId, articleData)
        .then(res => {
            navigate('/');
            displaySuccessNotification('Edited successfully.');
        })
        .catch(error => displayErrorNotification(error));
}

function displaySuccessNotification(message) {
    const successBoxParagraphElem = document.getElementById('successBox');
    const successBoxSectionElem = successBoxParagraphElem.parentElement;

    successBoxParagraphElem.innerHTML = message;
    successBoxSectionElem.style.display = 'block';
    successBoxSectionElem.scrollIntoView(true);

    setTimeout(() => {
        successBoxSectionElem.style.display = 'none';
    }, 3000);
}

function displayErrorNotification(message) {
    const errorBoxParagraphElem = document.getElementById('errorBox');
    const errorBoxSectionElem = errorBoxParagraphElem.parentElement;

    errorBoxParagraphElem.innerHTML = message;
    errorBoxSectionElem.style.display = 'block';
    errorBoxSectionElem.scrollIntoView(true);
    setTimeout(() => {
        errorBoxSectionElem.style.display = 'none';
    }, 3000);
}

function navigate(path) {
    history.pushState({}, '', path);
    router(path);
}