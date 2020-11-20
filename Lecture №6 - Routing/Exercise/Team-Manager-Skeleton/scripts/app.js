const auth = firebase.auth();
const notificationDivElem = document.getElementById('infoBox');
const errDivElem = document.getElementById('errorBox');
const sessionStorage = window.sessionStorage;
const router = Sammy('#main', function () {

    this.use('Handlebars', 'hbs');

    this.get('/', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/home/home.hbs');
            });
    });

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
                        this.partial('./templates/catalog/teamCatalog.hbs', { email, loggedIn, hasNoTeam: hasNoTeam, teams });
                    });
            });
    });

    this.get('/catalog/:id', function (context) {
        const id = context.params.id;
        const currentUsername = sessionStorage.email;

        loadTeam(id)
            .then(teamInfo => {
                const isAuthor = currentUsername === teamInfo.creator ? true : false;
                let isOnTeam = false;
                console.log(teamInfo.members);
                
                teamInfo.members.forEach(member => {
                    if (member.username === currentUsername) {
                        isOnTeam = true;
                    }
                });

                const team = {
                    isAuthor,
                    isOnTeam,
                    name: teamInfo.name,
                    members: teamInfo.members,
                    comment: teamInfo.comment,
                    creator: teamInfo.creator,
                    teamId: id,
                };

                sessionStorage.setItem('teamId', team.teamId);
                sessionStorage.setItem('teamName', team.name);
                sessionStorage.setItem('teamComment', team.comment);
                sessionStorage.setItem('isAuthor', isAuthor);
                sessionStorage.setItem('isOnTeam', isOnTeam);
                sessionStorage.setItem('members', JSON.stringify(team.members));
                sessionStorage.setItem('creator', team.creator);

                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/catalog/details.hbs', team);
                    });
            });
    });

    this.get('/leave', function (context) {
        sessionStorage.setItem('hasTeam', false);
        const userId = sessionStorage.getItem('userId');
        const hasNoTeam = true;
        const hasTeam = false
        const teamId = sessionStorage.getItem('teamId');
        const teamName = sessionStorage.getItem('teamName');
        const teamComment = sessionStorage.getItem('teamComment');
        let members = JSON.parse(sessionStorage.getItem('members'))
        let memberToRemove;

        members.forEach((member, index) => {
            if (member.username === sessionStorage.getItem('email')) {
                memberToRemove = index;
            }
        });

        members.splice(memberToRemove, 1);
        sessionStorage.setItem('members', JSON.stringify(members));

        updateTeam({ name: teamName, comment: teamComment, members, teamId })
            .then(() => {
                changeTeamBelonging(userId, hasNoTeam, hasTeam, '')
                    .then(() => {
                        loadPartials(context)
                            .then(function () {
                                this.partial('./templates/home/home.hbs', { loggedIn: true, email: context.params.email, hasTeam });
                                displayNotification('You left your team successfully');
                            });
                    });
            })
    });

    this.get('/create', function (context) {
        loadPartials(context)
            .then(function () {
                this.partial('./templates/create/createPage.hbs');
            });
    });

    this.get('/edit/:id', function (context) {
        loadPartials(context)
            .then(function () {

                const teamInfo = {
                    name: sessionStorage.getItem('teamName'),
                    teamId: sessionStorage.getItem('teamId'),
                    comment: sessionStorage.getItem('teamComment'),
                }

                this.partial('../templates/edit/editPage.hbs', teamInfo);;
            });
    });

    this.post('/edit/:id', function (context) {

        const teamInfo = {
            name: context.params.name,
            teamId: context.params.id,
            comment: context.params.comment,
            isAuthor: sessionStorage.getItem('isAuthor'),
            isOnTeam: sessionStorage.getItem('isOnTeam'),
            members: JSON.parse(sessionStorage.getItem('members')),
            creator: sessionStorage.getItem('creator'),
        }

        updateTeam(teamInfo)
            .then(() => {
                loadPartials(context)
                    .then(function () {
                        displayNotification('Team info updated successfully');
                        context.redirect(`/catalog/${teamInfo.teamId}`);
                    });
            });
    });

    this.post('/create', function (context) {
        const creator = sessionStorage.getItem('email');
        const userId = sessionStorage.getItem('userId');
        const teamName = context.params.name;
        const comment = context.params.comment;
        const hasNoTeam = false;
        const hasTeam = true;


        createTeam(creator, teamName, comment)
            .then((res) => {
                const teamId = res;
                changeTeamBelonging(userId, hasNoTeam, hasTeam, teamId)
                    .then(() => {
                        this.redirect('/catalog');
                    })
            })

        loadPartials(context)
            .then(function () {
                this.partial('./templates/create/createPage.hbs');
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

        getUserInfo(email)
            .then(userInfo => {
                sessionStorage.setItem('userId', userInfo.id);
                sessionStorage.setItem('hasNoTeam', userInfo.hasNoTeam);
                sessionStorage.setItem('hasTeam', userInfo.hasTeam);
                sessionStorage.setItem('teamId', userInfo.teamId);
            });

        auth.signInWithEmailAndPassword(email, password)
            .then(function () {
                loadPartials(context)
                    .then(function () {
                        this.partial('./templates/home/home.hbs', { loggedIn: true, email: context.params.email, hasTeam: sessionStorage.getItem('hasTeam'), teamId: sessionStorage.getItem('teamId') });
                        displayNotification('Successfully logged in.')
                    });
            })
            .catch(error => displayError(error.message));
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
        'teamMember': './templates/catalog/teamMember.hbs',
        'teamControls': './templates/catalog/teamControls.hbs',
        'createForm': './templates/create/createForm.hbs',
        'editForm': './templates/edit/editForm.hbs',
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
                hasNoTeam: user[1].hasNoTeam,
                hasTeam: user[1].hasNoTeam,
                teamId: user[1].teamId,
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

async function changeTeamBelonging(userId, hasNoTeam, hasTeam, teamId) {
    const req = fetch(`https://team-manager-js-app.firebaseio.com/users/${userId}.json`, {
        method: 'PATCH',
        body: JSON.stringify({
            hasNoTeam,
            hasTeam,
            teamId,
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
            members: [{ username: creator }],
        }),
    });

    const res = await req;

    return await res.json();
}

async function updateTeam(team) {
    const req = fetch(`https://team-manager-js-app.firebaseio.com/teams/${team.teamId}.json`, {
        method: 'PATCH',
        body: JSON.stringify({
            name: team.name,
            comment: team.comment,
            members: team.members,
        }),
    });

    const res = await req;

    return await res.json();
}

async function leaveTeam(teamId, usereMail) {
    const req = fetch(`https://team-manager-js-app.firebaseio.com/teams/${teamId}.json`, {
        method: 'PATCH'
    })
}