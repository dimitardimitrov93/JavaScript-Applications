import { html } from '../../node_modules/lit-html/lit-html.js';

export default (article) => html`
    <section class="js">
        <h2>${article.title}</h2>
        <div class="articles">
            <article>
                <h3>${article.category}</h3>
                <p>${article.content}</p>
                <a href="/details" class="btn details-btn">Details</a>
            </article>
        </div>
    </section>
`;