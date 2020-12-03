function attachEvents() {
    const navigationTemplate = Handlebars.compile(document.getElementById('navigation-template').innerHTML);
    const recipeCardTemplate = Handlebars.compile(document.getElementById('recipe-card-template').innerHTML);

    Handlebars.registerPartial('navigation-template', navigationTemplate);
    Handlebars.registerPartial('recipe-card-template', recipeCardTemplate);

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
    } else if (e.target.parentElement.tagName === 'A' && e.target.parentElement.href) {
        const url = new URL(e.target.parentElement.href);
        navigate(url.pathname);
    }
}

function onRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['register-form']);
    const email = formData.get('username');
    const password = formData.get('password');
    const repeatedPassword = formData.get('repeatPassword');

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
    const email = formData.get('username');
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

function onCreatedRecipeSubmit(e) {
    e.preventDefault();
    const imageUrlPattern = /^http:\/\/|https:\/\/.+/;
    const formData = new FormData(document.forms['create-recipe-form']);
    const title = formData.get('title');
    const description = formData.get('description');
    const imageUrl = formData.get('imageURL');
    const creator = JSON.parse(localStorage.getItem('auth')).email;

    if (!title.trim() || title.trim().length < 6) {
        displayErrorNotification('The title should be at least 6 characters long.');
        return;
    } else if (!description.trim() || description.trim().length < 10) {
        displayErrorNotification('The description should be at least 6 characters long.');
        return;
    } else if (!imageUrl.trim() || !imageUrlPattern.test(imageUrl)) {
        displayErrorNotification(`The image should start with "http://" or "https://".`);
        return;
    }

    recipeService.addRecipe({
        title,
        description,
        imageUrl,
        creator,
        peopleLiked: [""],
        comments: [""],
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
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl'),
    }

    const articleId = location.href.replace(new RegExp(/.*\//), '');

    if (!articleData.title.trim() || !articleData.description.trim() || !articleData.imageUrl.trim()) {
        displayErrorNotification('Invalid inputs!');
        return;
    }

    recipeService.editArticle(articleId, articleData)
        .then(res => {
            navigate('/');
            displaySuccessNotification('Edited successfully.');
        })
        .catch(error => displayErrorNotification(error));
}

//edit
async function likeRecipe(e, recipeId) {
    let currentUser = JSON.parse(localStorage.getItem('auth')).email;
    let { peopleLiked } = await productService.getProduct(recipeId);

    if (peopleLiked.includes('')) {
        peopleLiked.splice(peopleLiked.indexOf(''), 1);
    }
    
    peopleLiked.push(currentUser);

    await recipeService.buyProduct(recipeId, { peopleLiked })
        .then(res => {
            navigate(`/details/${recipeId}`);
        })
        .catch(error => displayErrorNotification(error.message));
}

function displaySuccessNotification(message) {
    const successBoxDivElem = document.getElementById('successBox');

    successBoxDivElem.innerHTML = message;
    successBoxDivElem.style.display = 'block';
    successBoxDivElem.scrollIntoView(true);

    setTimeout(() => {
        successBoxDivElem.style.display = 'none';
    }, 3000);
}

function displayErrorNotification(message) {
    const errorBoxDivElem = document.getElementById('errorBox');

    errorBoxDivElem.innerHTML = message;
    errorBoxDivElem.style.display = 'block';
    errorBoxDivElem.scrollIntoView(true);
    setTimeout(() => {
        errorBoxDivElem.style.display = 'none';
    }, 3000);
}

function navigate(path) {
    history.pushState({}, '', path);
    router(path);
}