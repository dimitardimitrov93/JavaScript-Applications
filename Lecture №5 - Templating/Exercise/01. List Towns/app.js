function attachEvents() {    
    const inputElement = document.getElementById('towns');
    const loadButtonElement = document.getElementById('btnLoadTowns');
    const townsListUlElement = document.getElementById('towns-list');
    const townsView = document.getElementById('towns-view').innerHTML;

    loadButtonElement.addEventListener('click', createTemplate);
    
    function createTemplate() {
        const townsArr = formatInputValues();
        const townsTemplate = Handlebars.compile(townsView);
        const townsHtml = townsArr.map(value => townsTemplate({town: value})).join('');
        renderTemplate(townsHtml);
    }

    function renderTemplate(template) {
        townsListUlElement.innerHTML = template;
    }

    function formatInputValues() {
        let inputValuesArr = [];

        if (inputElement.value.includes(',')) {
            inputValuesArr = inputElement.value
                .split(',')
                .map(value => value.trim());

            for (const index in inputValuesArr) {
                let townName = '';

                if (inputValuesArr[index].includes(' ')) {
                    townName = inputValuesArr[index]
                    .split(' ')
                    .map(x => x.trim()[0].toUpperCase() + x.trim().slice(1).toLowerCase())
                    .join(' ');
                } else {
                    townName = inputValuesArr[index][0].toUpperCase() + inputValuesArr[index].slice(1).toLowerCase();
                }

                inputValuesArr[index] = townName;
            }
        } else {
            inputValuesArr.push(inputElement.value.trim()[0].toUpperCase() + inputElement.value.trim().slice(1).toLowerCase());
        }

        clearInput();
        return inputValuesArr;
    }

    function clearInput() {
        inputElement.value = '';
    }
}

attachEvents();