const auth = firebase.auth();
const notificationDivElem = document.getElementById('infoBox');
const errDivElem = document.getElementById('errorBox');
const sessionStorage = window.sessionStorage;
const router = Sammy('#main', function () {

    this.use('Handlebars', 'hbs');

    this.get('/home', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/home/home.hbs');
            });
    });

    this.get('/login', function (context) {
        const email = sessionStorage.getItem('email');
        const password = sessionStorage.getItem('password');

        loadPartials(context)
            .then(function () {
                this.partial('./templates/login/loginPage.hbs', { email, password });
            });
    });

    this.get('/about', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('../templates/about/about.hbs');
            });
    });

    this.get('/register', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/register/registerPage.hbs');
            });
    });

    this.get('/catalog', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/catalog/registerPage.hbs');
            });
    });

    this.get('/', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/home/home.hbs');
            });
    });

    this.post('/register', function (context) {
        const { email, password, repeatPassword } = context.params;

        if (password !== repeatPassword) {
            displayError('Passwords mismatch!');
            return;
        };

        sessionStorage.setItem('email', email);
        sessionStorage.setItem('password', password);

        auth.createUserWithEmailAndPassword(email, password)
            .then(res => {
                displayNotification('You were registered successfully.');
                this.redirect('/login')
            })
            .catch(error => {
                displayError(error.message);
            });
    });

    this.post('/login', function (context) {
        const email = context.params.email;
        const password = context.params.password;

        auth.signInWithEmailAndPassword(email, password)
            .then(function () {
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/home/home.hbs', {loggedIn: true, email: context.params.email});
                    });
            })
    });

});

(() => {
    router.run('/home');
})();

function loadPartials(context) {
    return context.loadPartials({
        'header': './templates/common/header.hbs',
        'footer': './templates/common/footer.hbs',
        'loginForm': './templates/login/loginForm.hbs',
        'loginPage': './templates/register/registerPage.hbs',
        'registerForm': './templates/register/registerForm.hbs',
        //'catalog': './templates/catalog/catalog.hbs',
    });
}

function displayNotification(infoMsg) {
    notificationDivElem.innerHTML = infoMsg;
    notificationDivElem.style.display = 'block';

    setTimeout(() => {
        notificationDivElem.style.display = 'none';
        notificationDivElem.innerHTML = '';
    }, 3000);
}

function displayError(errorMessage) {
    errDivElem.innerHTML = `${errorMessage}.`;
    errDivElem.style.display = 'block';

    setTimeout(() => {
        errDivElem.style.display = 'none';
        errDivElem.innerHTML = '';
    }, 3000);
}
