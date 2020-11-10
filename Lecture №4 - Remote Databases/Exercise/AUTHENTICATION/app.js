function attachEvents() {
    const auth = firebase.auth();

    const bodyElement = document.getElementsByTagName('BODY')[0];
    const emailInputElement = document.querySelector('.login-form form input:nth-child(2)');
    const passwordInputElement = document.querySelector('.login-form form input:nth-child(4)');

    const loginSectionElement = document.querySelector('.login-form');
    const registerSectionElement = document.querySelector('.register-form');
    const loggedInSectionElement = document.querySelector('.logged-in');
    const loginButtonElement = document.querySelector('.login-btn');
    const successfulRegSpanElement = document.querySelector('.successful-reg-msg');
    const welcomeMsgH1Element = document.querySelector('.welcome-msg');
    const logoutButtonElement = document.querySelector('.logout-btn');
    const loginInputElements = Array.from(document.querySelectorAll('.login-form form input'));
    const loginAnchorElement = document.querySelector('.log-in-anchor');
    loginInputElements.pop();
    
    const registrationFormLinkElement = document.querySelector('.register-link');
    const registerInputElementsArr = Array.from(document.querySelectorAll('.register-form form input'));
    registerInputElementsArr.pop();
    const registerButtonElement = document.querySelector('.register-form input.register-btn');

    let [firstName, lastName, email, password] = '';

    registrationFormLinkElement.addEventListener('click', displayRegisterForm);
    registerButtonElement.addEventListener('click', registerNewUser);
    loginAnchorElement.addEventListener('click', displayLoginForm);
    loginButtonElement.addEventListener('click', logIn);
    logoutButtonElement.addEventListener('click', logOut);

    function displayRegisterForm() {
        loginSectionElement.style.display = 'none';
        registerSectionElement.style.display = 'flex';
    }

    function displayLoginForm() {
        loginSectionElement.style.display = 'flex';
        registerSectionElement.style.display = 'none';
        successfulRegSpanElement.style.display = 'none';
        emailInputElement.value = email;
        passwordInputElement.value = password;
    }

    function registerNewUser() {
        if (!areInputsValid(registerInputElementsArr)) return;

        [firstName, lastName, email, password] = registerInputElementsArr.map(input => input.value);
        clearInputValues(registerInputElementsArr);

        auth.createUserWithEmailAndPassword(email, password)
            .then(res => {
                successfulRegSpanElement.style.display = 'block';
                // register user with displayName
            })
            .catch(err => {
                console.log(`Error ${err.message}`);
            });
    }

    function logIn() {
        auth.signInWithEmailAndPassword(email = emailInputElement.value, password = passwordInputElement.value)
            .then(res => {
                clearInputValues(loginInputElements);
                displayWelcomePage(firstName, lastName);
            })
            .catch(err => {
                console.log(`Error: ${err.message}`);
            });
    }

    function logOut() {
        auth.signOut()
            .then(res => {
                bodyElement.style.backgroundImage = 'linear-gradient(to bottom, rgba(000, 0, 0, 0.5) 0%, rgba(000, 0, 0, 0.5) 100%), url(https://images.unsplash.com/photo-1463797221720-6b07e6426c24)';
                loginSectionElement.style.display = 'flex';
                loggedInSectionElement.style.display = 'none';
            })
            .catch(err => {
                console.log(`Error: ${err.message}`);
            });
    }

    function areInputsValid(inputsArr) {
        return inputsArr.every(input => (input.value && input.value.trim() !== ''));
    }

    function displayWelcomePage(firstName, lastName) {
        bodyElement.style.backgroundImage = 'linear-gradient(to bottom, rgba(000, 0, 0, 0.5) 0%, rgba(000, 0, 0, 0.5) 100%), url(https://images.unsplash.com/photo-1530103862676-de8c9debad1d)';
        loginSectionElement.style.display = 'none';
        welcomeMsgH1Element.innerText = `Welcome, ${firstName} ${lastName}.`;
        loggedInSectionElement.style.display = 'block';
    }

    function clearInputValues(inputArr) {
        inputArr.forEach(input => input.value = '');
    }
}

attachEvents();