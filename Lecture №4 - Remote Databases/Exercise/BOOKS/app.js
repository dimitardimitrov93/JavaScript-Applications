function attachEvents() {
    const appBaseUrl = `https://b00ks-js-advanced.firebaseio.com`;
    const tbodyElement = document.getElementsByTagName('tbody')[0];
    const inputElementsArr = Array.from(document.getElementsByTagName('input'));
    const buttonsElementsArr = Array.from(document.getElementsByTagName('button'));
    const titleInputElement = document.getElementById('title');
    const authorInputElement = document.getElementById('author');
    const isbnInputElement = document.getElementById('isbn');
    const loadAllBooksButtonElement = document.getElementById('loadBooks');
    const formElement = document.querySelector('form');
    const editButtonElement = document.createElement('button');
    const submitButtonElement = document.querySelector('form > button');

    editButtonElement.textContent = 'Edit';
    editButtonElement.style.cursor = 'pointer';
    editButtonElement.style.display = 'none';
    formElement.appendChild(editButtonElement);

    editButtonElement.addEventListener('click', editBook);
    submitButtonElement.addEventListener('click', addNewBook);
    loadAllBooksButtonElement.addEventListener('click', displayAllBooks);
    tbodyElement.addEventListener('click', determineAction);

    function determineAction(e) {
        if (e.target.tagName === 'BUTTON' && e.target.innerText === 'Edit') {
            const bookTrElement = e.target.closest('tr');
            const book = {
                key: bookTrElement.dataset.key,
                title: bookTrElement.firstElementChild.innerText,
                author: e.target.parentElement.previousSibling.previousSibling.innerText,
                isbn: e.target.parentElement.previousSibling.innerText,
                key: bookTrElement.dataset.key,
            }

            fillFormWithBookDataForEdit(book);
        } else if (e.target.tagName === 'BUTTON' && e.target.innerText === 'Delete') {
            const bookKey = e.target.closest('tr').dataset.key;
            deleteBook(bookKey);
        }
    }

    function addNewBook(e) {
        e.preventDefault();

        let areInputsValid = validateInputs(inputElementsArr);

        if (!areInputsValid) return;

        const newBook = {
            title: titleInputElement.value,
            author: authorInputElement.value,
            isbn: isbnInputElement.value,
        };

        fetch(`${appBaseUrl}/books.json`, {
            method: 'POST',
            body: JSON.stringify(newBook),
        })
            .then(res => res.json())
            .then(keyObj => {
                createNewTableRowWithBook([Object.values(keyObj)[0], newBook]);
            })
            .catch(err => {
                console.log(`Error: ${err.message}`);
            });

        clearInputValues();
    }

    function editBook(e) {
        e.preventDefault();

        titleInputElement.focus();
        titleInputElement.scrollIntoView(false);

        let areInputsValid = validateInputs(inputElementsArr);
        let dataKey = e.target.dataset.key;

        if (!areInputsValid) return;

        const newBook = {
            title: titleInputElement.value,
            author: authorInputElement.value,
            isbn: isbnInputElement.value,
        };

        fetch(`${appBaseUrl}/books/${dataKey}.json`, {
            method: 'PUT',
            body: JSON.stringify(newBook),
        })
            .then(res => res.json())
            .then(keyObj => {
                submitButtonElement.style.display = 'block';
                editButtonElement.style.display = 'none';
                displayAllBooks();
            })
            .catch(err => {
                console.log(`Error: ${err.message}`);
            });

        clearInputValues();
    }

    function deleteBook(bookKey) {
        fetch(`${appBaseUrl}/books/${bookKey}.json`, {
            method: 'DELETE',
        })
            .then(res => {
                displayAllBooks();
            })
            .catch(err => {
                console.log(`Error: ${err.message}`);
            });
    }

    function validateInputs(params) {
        let inputElementsArr;
        console.log(Array.isArray(params));

        Array.isArray(params) === true ? inputElementsArr = params : inputElementsArr = [params];
        let areInputsValid = true;

        for (const inputElement of inputElementsArr) {
            if (inputElement.value.trim() === '') {
                inputElement.style.border = '1px solid rgb(255, 0, 0)';
                areInputsValid = false;
            } else {
                inputElement.style.border = '1px solid rgb(118, 118, 118)';
            }
        }

        return areInputsValid;
    }

    function displayAllBooks() {
        clearInputValues();
        fetch(`${appBaseUrl}/books.json`)
            .then(res => res.json())
            .then(data => Object.entries(data))
            .then(booksArr => {
                tbodyElement.innerHTML = '';
                booksArr.forEach(book => createNewTableRowWithBook(book));
            })
            .catch(err => {
                console.log(`Error: ${err.message}`);
            });
    }

    function fillFormWithBookDataForEdit(book) {
        titleInputElement.value = book.title;
        authorInputElement.value = book.author;
        isbnInputElement.value = book.isbn;
        submitButtonElement.style.display = 'none';
        editButtonElement.style.display = 'block';
        editButtonElement.dataset.key = book.key;
    }

    function createNewTableRowWithBook(book) {
        const newBookTrElement = document.createElement('tr');
        const titleTdElement = document.createElement('td');
        const authorTdElement = document.createElement('td');
        const isbnTdElement = document.createElement('td');
        const actionTdElement = document.createElement('td');
        const editButtonElement = document.createElement('button');
        const deleteButtonElement = document.createElement('button');

        newBookTrElement.dataset.key = book[0];
        titleTdElement.innerText = book[1].title;
        authorTdElement.innerText = book[1].author;
        isbnTdElement.innerText = book[1].isbn;
        editButtonElement.innerText = 'Edit';
        deleteButtonElement.innerText = 'Delete';

        editButtonElement.style.cursor = 'pointer';
        deleteButtonElement.style.cursor = 'pointer';

        actionTdElement.appendChild(editButtonElement);
        actionTdElement.appendChild(deleteButtonElement);
        newBookTrElement.appendChild(titleTdElement);
        newBookTrElement.appendChild(authorTdElement);
        newBookTrElement.appendChild(isbnTdElement);
        newBookTrElement.appendChild(actionTdElement);
        tbodyElement.appendChild(newBookTrElement);
    }

    function clearInputValues() {
        inputElementsArr.forEach(inputElement => inputElement.value = '');
    }

    buttonsElementsArr.forEach(buttonElement => {
        buttonElement.style.cursor = 'pointer';
    });

    document.addEventListener('focusout', (e) => {
        if (e.target.tagName === 'INPUT') validateInputs(e.target);
    });
}

attachEvents();