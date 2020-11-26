function attachEvents() {
    const navigationTemplate = Handlebars.compile(document.getElementById('navigation-template').innerHTML);
    const productCardTemplate = Handlebars.compile(document.getElementById('product-card-template').innerHTML);
    let counter = 0;
    // const editProductTemplate = Handlebars.compile(document.getElementById('edit-product-template').innerHTML);

    Handlebars.registerPartial('navigation-template', navigationTemplate);
    Handlebars.registerPartial('product-card-template', productCardTemplate);
    // Handlebars.registerPartial('edit-product-template', editProductTemplate);

    navigate('/home');
}

attachEvents();

window.addEventListener('popstate', (e) => {
    navigate(location.pathname);
});

function navigationHandler(e, productId) {
    e.preventDefault();
    
    if (e.target.tagName === 'A' && e.target.href) {
        const url = new URL(e.target.href);
        navigate(url.pathname);
    } else if (e.target.tagName === 'BUTTON') {
        const url = new URL(e.target.parentElement.href);
        navigate(url.pathname);
    } else if (e.target.id === 'home-link') {
        navigate('/home');
    } else if (e.target.parentElement.classList.value === 'shoe') {
        navigate(`/details/${productId}`);
    }
}

function onRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['register-form']);
    const email = formData.get('email');
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

function onCreatedOfferSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['create-offer-form']);
    const name = formData.get('name');
    const price = Number(formData.get('price')).toFixed(2);
    const imageUrl = formData.get('imageUrl');
    const description = formData.get('description');
    const brand = formData.get('brand');
    const creator = JSON.parse(localStorage.getItem('auth')).email;

    if (!name.trim() || !description.trim() || !imageUrl.trim() || !price.trim() || !brand.trim()) {
        displayErrorNotification('Invalid inputs!');
        return;
    }

    productService.add({
        name,
        price,
        description,
        imageUrl,
        brand,
        creator,
        peopleBought: [""], // check
    })
        .then(res => {
            displaySuccessNotification('Created successfully!');
            navigate('/home');
        })
        .catch(error => displayErrorNotification(error.message));
}

function onEditProductSubmit(e) {
    e.preventDefault();
    const formData = new FormData(document.forms['editProductForm']);

    const productData = {
        name: formData.get('name'),
        price: Number(formData.get('price')).toFixed(2),
        imageUrl: formData.get('imageUrl'),
        description: formData.get('description'),
        brand: formData.get('brand'),
    }

    const productId = location.href.replace(new RegExp(/.*\//), '');

    if (!productData.name.trim() || !productData.description.trim() || !productData.imageUrl.trim() || !productData.price.trim() || !productData.brand.trim()) {
        displayErrorNotification('Invalid inputs!');
        return;
    }

    productService.editProduct(productId, productData)
        .then(res => {
            navigate(`/details/${productId}`);
            displaySuccessNotification('Edited successfully.');
        })
        .catch(error => displayErrorNotification(error.message));
}

async function buyProduct(e, productId) {
    let currentUser = JSON.parse(localStorage.getItem('auth')).email;
    let { peopleBought } = await productService.getProduct(productId);

    if (peopleBought.includes('')) {
        peopleBought.splice(peopleBought.indexOf(''), 1);
    }
    peopleBought.push(currentUser);

    await productService.buyProduct(productId, { peopleBought })
        .then(res => {
            navigate(`/details/${productId}`);
        })
        .catch(error => displayErrorNotification(error.message));
}

function displaySuccessNotification(message) {
    const successBoxParagraphElem = document.getElementById('successBox');
    const successBoxSectionElem = successBoxParagraphElem.parentElement;

    successBoxParagraphElem.innerHTML = message;
    successBoxSectionElem.style.display = 'block';
    successBoxSectionElem.scrollIntoView(true);

    setTimeout(() => {
        successBoxSectionElem.style.display = 'none';
    }, 1000);
}

function displayErrorNotification(message) {
    const errorBoxParagraphElem = document.getElementById('errorBox');
    const errorBoxSectionElem = errorBoxParagraphElem.parentElement;

    errorBoxParagraphElem.innerHTML = message;
    errorBoxSectionElem.style.display = 'block';
    errorBoxSectionElem.scrollIntoView(true);
    setTimeout(() => {
        errorBoxSectionElem.style.display = 'none';
    }, 1000);
}

function navigate(path) {
    history.pushState({}, '', path);
    router(path);
}