function attachEvents() {

    const inputElementsArr = Array.from(document.getElementsByTagName('input'));
    const [idInputElement, firstNameInputElement, lastNameInputElement, facultyNumberInputElement, gradeInputElement] = inputElementsArr;
    let areInputsValid = true;
    const tbodyElement = document.getElementsByTagName('tbody')[0];
    const listStudentsButton = document.querySelector('.list-students-btn');

    const registerButtonElement = document.querySelector('button.register-btn');

    const dbBaseUrl = `https://js-applications-students.firebaseio.com`;

    listStudentsButton.addEventListener('click', fetchStudents);
    registerButtonElement.addEventListener('click', registerNewStudent);

    function registerNewStudent(e) {
        e.preventDefault();
        validateInputs(inputElementsArr)

        const newStudentData = {};
        [newStudentData.id, newStudentData.firstName, newStudentData.lastName, newStudentData.facultyNumber, newStudentData.grade] = inputElementsArr.map(x => x.value);
        clearInputs();

        fetch(`${dbBaseUrl}/students.json`, {
            method: 'POST',
            body: JSON.stringify(newStudentData),
        })
            .then(res => res.json())
            .then(key => {
                displayStudent([key, newStudentData]);
            })
            .catch(err => {
                console.log(`Error: ${err.message}`);
            });
    }

    function validateInputs(inputElementsArr) {

        for (const inputElement of inputElementsArr) {
            if (inputElement.value.trim() === '') {
                areInputsValid = false;
                inputElement.style.backgroundColor = '#fcd1cf';
            } else {
                inputElement.style.border = '1px solid rgb(118, 118, 118)';
            }
        }

        return areInputsValid;
    }

    function fetchStudents() {
        fetch(`${dbBaseUrl}/students.json`)
            .then(res => res.json())
            .then(students => {
                tbodyElement.innerHTML = '';

                Object.entries(students).forEach(student => {
                    displayStudent(student);
                });
            })
            .catch(err => {
                console.log(`Error: ${err.message}`);
            });
    }

    function displayStudent(student) {
        const trElement = document.createElement('tr');
        const idTdElement = document.createElement('td');
        const firstNameTdElement = document.createElement('td');
        const lastNameTdElement = document.createElement('td');
        const FactultyNumberTdElement = document.createElement('td');
        const gradeTdElement = document.createElement('td');

        trElement.dataset.key = student[0];
        idTdElement.textContent = student[1].id;
        firstNameTdElement.textContent = student[1].firstName;
        lastNameTdElement.textContent = student[1].lastName;
        FactultyNumberTdElement.textContent = student[1].facultyNumber;
        gradeTdElement.textContent = student[1].grade;

        trElement.appendChild(idTdElement);
        trElement.appendChild(firstNameTdElement);
        trElement.appendChild(lastNameTdElement);
        trElement.appendChild(FactultyNumberTdElement);
        trElement.appendChild(gradeTdElement);

        tbodyElement.appendChild(trElement);
        sortStudents()

    }

    function clearInputs() {
        inputElementsArr.forEach(inputElement => {
            inputElement.value = '';
        });
    }

    function sortStudents() {
        const allStudentsTrElements = Array.from(document.querySelectorAll('tbody > tr'));
        allStudentsTrElements.sort((a, b) => {
            let idA = Number(a.firstElementChild.textContent);
            let idB = Number(b.firstElementChild.textContent);
            return idA - idB;
        });

        allStudentsTrElements.forEach(studentTrElement => {
            tbodyElement.appendChild(studentTrElement);
        });
    }
}

attachEvents();