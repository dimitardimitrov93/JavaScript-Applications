function renderCatTemplate() {
    const allCatsSectionElement = document.getElementById('allCats');
    const catTemplate = document.getElementById('cat-template');
    const compiledCatTemplate = Handlebars.compile(catTemplate.innerHTML);
    const allCatsHtml = compiledCatTemplate({ cats });
    allCatsSectionElement.innerHTML = allCatsHtml;

    allCatsSectionElement.addEventListener('click', showStatusCode);

    function showStatusCode(e) {
        if (e.target.tagName === 'BUTTON' && e.target.innerHTML === 'Show status code') {
            const statusCodeDiv = e.target.nextElementSibling;

            if (statusCodeDiv.style.display !== 'block') {
                statusCodeDiv.style.display = 'block';
            } else {
                statusCodeDiv.style.display = 'none';
            }
        }
    }
}

renderCatTemplate()
