$(() => {
    const monkeysContainerDiv = document.querySelector('.monkeys');
    const monkeyTemplate = document.getElementById('monkey-template');

    const compiledMonkeyTemplate = Handlebars.compile(monkeyTemplate.innerHTML);
    const allMonkeysHtml = compiledMonkeyTemplate({ monkeys });
    monkeysContainerDiv.innerHTML = allMonkeysHtml;

    monkeysContainerDiv.addEventListener('click', showInfo);

    function showInfo(e) {
        if (e.target.tagName === 'BUTTON' && e.target.innerHTML === 'Info') {
            const infoParagraphElement = e.target.nextElementSibling;
            const parentMonkeyDiv = e.target.parentElement;

            if (infoParagraphElement.style.display !== 'block') {
                infoParagraphElement.style.display = 'block';
                parentMonkeyDiv.scrollIntoView(false);
            } else {
                infoParagraphElement.style.display = 'none';
            }
        }
    }
})