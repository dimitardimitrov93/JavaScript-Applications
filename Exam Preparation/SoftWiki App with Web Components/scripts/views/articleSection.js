import { html } from '../../node_modules/lit-html/lit-html.js';

export default (article, navigationHandler) => html`
    <section class="js">
        <article>
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <a href="/details/${article.articleId}" @click=${navigationHandler} class="btn details-btn">Details</a>
        </article>
    </section>
`;