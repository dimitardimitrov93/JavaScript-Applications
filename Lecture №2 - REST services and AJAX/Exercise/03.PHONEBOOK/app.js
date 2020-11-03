function attachEvents() {
    const ulPhonebookElement = document.getElementById('phonebook');
    const loadButtonElement = document.getElementById('btnLoad');
    const createButtonElement = document.getElementById('btnCreate');
    const personInputElement = document.getElementById('person');
    const phoneInputElement = document.getElementById('phone');
    let localDatabase = {};

    const loadContactsUrl = `https://phonebook-nakov.firebaseio.com/phonebook.json`;
    loadButtonElement.addEventListener('click', () => loadContacts());

    ulPhonebookElement.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON' && e.target.innerHTML === 'Delete') {
            let contactToDelete = e.target.parentElement.innerHTML.split(':')[0];
            let currentId = localDatabase[contactToDelete];
            let url = `https://phonebook-nakov.firebaseio.com/phonebook/${currentId}.json`;
            fetch(url, {
                method: 'DELETE',
            })
                .then(() => loadContacts());
        }
    });

    createButtonElement.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON' && e.target.innerHTML === 'Create') {
            if ((!personInputElement.value || personInputElement.value.trim() === '') || (!phoneInputElement.value || phoneInputElement.value.trim() === '')) return;

            let newContact = {
                person: personInputElement.value,
                phone: phoneInputElement.value,
            };

            personInputElement.value = '';
            phoneInputElement.value = '';

            fetch('https://phonebook-nakov.firebaseio.com/phonebook.json', {
                method: 'POST',
                body: JSON.stringify(newContact),
            })
                .then(() => loadContacts());
        }
    });

    function updateContacts(contacts) {
        if (!contacts) {
            ulPhonebookElement.innerHTML = '<li>Phonebook is currently empty.</li>';
            return;
        }
        
        localDatabase = {};
        ulPhonebookElement.innerHTML = '';

        for (const contact in contacts) {
            let person = contacts[contact].person;
            let phone = contacts[contact].phone;
            let contactId = contact
            localDatabase[person] = contactId;

            ulPhonebookElement.innerHTML += `<li>${person}: ${phone}<button>Delete</button</li>`;
        }
    }

    function loadContacts() {
        fetch(loadContactsUrl)
            .then(response => response.json())
            .then(contacts => updateContacts(contacts))
            .catch(err => {
                ulPhonebookElement.innerHTML = '<li>Sorry, something went wrong. :(</li>';
            });
    }
}

attachEvents();