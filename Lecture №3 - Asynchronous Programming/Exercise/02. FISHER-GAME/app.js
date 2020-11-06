function attachEvents() {
    const loadButtonElement = document.querySelector('button.load');
    const addButtonElement = document.querySelector('button.add');
    const catchesDivElement = document.getElementById('catches');
    const addFormFieldSetElement = document.getElementById('addForm');

    loadButtonElement.addEventListener('click', listAllCatches);

    catchesDivElement.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON' && e.target.innerHTML === 'Update') {
            const updateCatchInputElements = e.target.parentElement.getElementsByTagName('input');
            const areAllInputsValid = Array.from(updateCatchInputElements).every(input => input.value || input.value.trim() !== '');
    
            if (areAllInputsValid) {
                Array.from(updateCatchInputElements).forEach(input => input.style.border = '1px solid #ccc');
    
                const catchId = e.target.parentElement.getAttribute('data-id');
                const inputData = Array.from(updateCatchInputElements)
                    .reduce((acc, input) => {
                        acc[input.classList.value] = input.value;
                        return acc;
                    }, {});
    
                updateCatch(catchId, inputData);
            } else {
                Array.from(updateCatchInputElements).forEach(input => {
                    if (!input.value || input.value.trim() === '') {
                        input.style.border = '1px solid #FF0000';
                    } else {
                        input.style.border = '1px solid #ccc';
                    }
                });
            }
        } else if (e.target.tagName === 'BUTTON' && e.target.innerHTML === 'Delete') {
            const catchId = e.target.parentElement.getAttribute('data-id');
            deleteCatch(catchId);
        }
    });

    addButtonElement.addEventListener('click', (e) => {
        const addCatchInputElements = addFormFieldSetElement.getElementsByTagName('input');
        const areAllInputsValid = Array.from(addCatchInputElements).every(input => input.value || input.value.trim() !== '');

        if (areAllInputsValid) {
            Array.from(addCatchInputElements).forEach(input => input.style.border = '1px solid #ccc');

            const inputData = Array.from(addCatchInputElements)
                .reduce((acc, input) => {
                    acc[input.classList.value] = input.value;
                    input.value = '';
                    return acc;
                }, {});

            createNewCatch(inputData);
        } else {
            Array.from(addCatchInputElements).forEach(input => {
                if (!input.value || input.value.trim() === '') {
                    input.style.border = '1px solid #FF0000';
                } else {
                    input.style.border = '1px solid #ccc';
                }
            });
        }
    });

    document.addEventListener('focusout', e => {
        if (e.target.tagName === 'INPUT') {
            if (e.target.value || e.target.value.trim() !== '') {
                e.target.style.border = '1px solid #ccc';
            } 
        }
    });

    function listAllCatches() {
        fetch(`https://fisher-game.firebaseio.com/catches.json`)
            .then(res => res.json())
            .then(allCatches => {
                catchesDivElement.innerHTML = '';
                Object.entries(allCatches).forEach(catchData => {
                    displayCatch(catchData);
                });
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    function displayCatch(catchData) {
        const catchId = catchData[0];
        const catchInfo = catchData[1];

        const newCatch = `
        <div class="catch" data-id="${catchId}">
        <label>Angler</label>
        <input type="text" class="angler" value="${catchInfo.angler}" />
        <hr>
        <label>Weight</label>      
        <input type="number" class="weight" value="${catchInfo.weight}" />
        <hr>
        <label>Species</label>
        <input type="text" class="species" value="${catchInfo.species}" />
        <hr>
        <label>Location</label>
        <input type="text" class="location" value="${catchInfo.location}" />
        <hr>
        <label>Bait</label>
        <input type="text" class="bait" value="${catchInfo.bait}" />
        <hr>
        <label>Capture Time</label>
        <input type="number" class="captureTime" value="${catchInfo.captureTime}" />
        <hr>
        <button class="update">Update</button>
        <button class="delete">Delete</button>
        </div>
        `

        catchesDivElement.innerHTML += newCatch;
    }

    function createNewCatch(inputData) {
        fetch(`https://fisher-game.firebaseio.com/catches.json`, {
            method: 'POST',
            body: JSON.stringify(inputData),
        })
            .catch(err => {
                console.log(err.message);
            });
    }

    function updateCatch(catchId, inputData) {
        const replacement = JSON.stringify(inputData);
        fetch(`https://fisher-game.firebaseio.com/catches/${catchId}.json`, {
            method: 'PUT',
            body: replacement,
        })
            .catch(err => {
                console.log(err.message);
            });
    }

    function deleteCatch(catchId) {
        fetch(`https://fisher-game.firebaseio.com/catches/${catchId}.json`, {
            method: 'DELETE',
        })
            .catch(err => {
                console.log(err.message);
            });
    }
}

attachEvents();

