const auth = firebase.auth();
const notificationDivElem = document.getElementById('infoBox');
const errDivElem = document.getElementById('errorBox');
const sessionStorage = window.sessionStorage;
const router = Sammy('#main', function () {

    this.use('Handlebars', 'hbs');

    this.get('/home', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('../templates/home/home.hbs');
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

    this.get('/logout', function (context) {
        auth.signOut()
            .then(() => {
                loadPartials(context)
                    .then(function () {
                        sessionStorage.removeItem('email');
                        sessionStorage.removeItem('password');
                        this.partial('./templates/home/home.hbs');
                        displayNotification('Successfully logged out.');
                    });
            })
            .catch(error => displayError(error.message));
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
        fetchTeams()
            .then(res => {
                let teams = [];
                const hasNoTeam = sessionStorage.getItem('hasNoTeam') === 'true' ? true : false;
                const loggedIn = sessionStorage.getItem('loggedIn');
                const email = sessionStorage.getItem('email');
                Object.entries(res).forEach(team => {
                    teams.push({
                        '_id': team[0],
                        name: team[1].name,
                        comment: team[1].comment,
                    });
                });

                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/catalog/teamCatalog.hbs', {email, loggedIn, hasNoTeam: hasNoTeam, teams });
                    });
            });
    });

    this.get('/catalog/:id', function (context) {
        const id = context.params.id;

        loadTeam(id)
            .then(team => {
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/catalog/details.hbs', team);
                    });
            })
    });

    this.get('/create', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/create/createPage.hbs');
            });
    })

    this.post('/create', function (context) {
        const creator = sessionStorage.getItem('email');
        const userId = sessionStorage.getItem('userId');
        const teamName = context.params.name;
        const comment = context.params.comment;

        createTeam(creator, teamName, comment)
            .then(() => {
                changeTeamBelonging(userId)
                    .then(() => {
                        this.redirect('/catalog');
                    })
            })

        loadPartials(context)
            .then(function () {
                this.partial('./templates/create/createPage.hbs');
            });
    })

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
                addUserToDb(email)
                    .then(res => {
                        displayNotification('You were registered successfully.');
                        this.redirect('/login')
                    });
            })
            .catch(error => {
                displayError(error.message);
            });
    });

    this.post('/login', function (context) {
        const { email, password } = context.params;
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('loggedIn', true);

        auth.signInWithEmailAndPassword(email, password)
            .then(function () {
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/home/home.hbs', { loggedIn: true, email: context.params.email });
                        displayNotification('Successfully logged in.')
                    });
            })
            .catch(error => displayError(error.message));

        getUserInfo(email)
            .then(userInfo => {
                sessionStorage.setItem('userId', userInfo.id);
                sessionStorage.setItem('hasNoTeam', userInfo.hasNoTeam);
            });
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
        'catalog': './templates/catalog/teamCatalog.hbs',
        'team': './templates/catalog/team.hbs',
        'details': './templates/catalog/details.hbs',
        'teamControls': './templates/catalog/teamControls.hbs',
        'createForm': './templates/create/createForm.hbs',
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
    errDivElem.innerHTML = errorMessage;
    errDivElem.style.display = 'block';

    setTimeout(() => {
        errDivElem.style.display = 'none';
        errDivElem.innerHTML = '';
    }, 3000);
}

async function fetchTeams() {
    const req = await fetch('https://team-manager-js-app.firebaseio.com/teams.json');
    const res = await req.json();
    return await res;
}

async function loadTeam(id) {
    const req = await fetch(`https://team-manager-js-app.firebaseio.com/teams/${id}.json`);
    const res = await req.json();
    return await res;
}

async function getUserInfo(email) {
    const req = await fetch('https://team-manager-js-app.firebaseio.com/users.json');
    const res = await req;
    const users = await res.json();
    let userInfo;

    Object.entries(await users).forEach(user => {
        if (user[1].email === email) {
            userInfo = {
                id: user[0],
                email: user[1].email,
                hasNoTeam: user[1].hasNoTeam
            };
        }
    });

    return await userInfo;
}

async function addUserToDb(email) {
    const req = await fetch('https://team-manager-js-app.firebaseio.com/users.json', {
        method: 'POST',
        body: JSON.stringify({
            email,
            hasNoTeam: true,
        })
    });

    const res = await req;
    return await res;
}

async function changeTeamBelonging(userId) {
    const req = fetch(`https://team-manager-js-app.firebaseio.com/users/${userId}.json`, {
        method: 'PATCH',
        body: JSON.stringify({
            hasNoTeam: false,
        }),
    });

    const res = await req;

    return await res.json();
}

async function createTeam(creator, teamName, comment) {
    const req = fetch('https://team-manager-js-app.firebaseio.com/teams.json', {
        method: 'POST',
        body: JSON.stringify({
            creator, 
            name: teamName, 
            comment,
            members: [],
        }),
    });

    const res = await req;

    return await res.json();
}