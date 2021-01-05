import { html } from '../../node_modules/lit-html/lit-html.js';

export default ({ article, navigationHandler, articleId }) => html`
    <div class="container details">
        <div class="details-content">
            <h2>${article.title}</h2>
            <strong>${article.category}</strong>
            <p>${article.content}</p>
            <div class="buttons">
                <a href="/delete/${articleId}" @click=${navigationHandler} class="btn delete">Delete</a>
                <a href="/edit/${articleId}" @click=${navigationHandler} class="btn edit">Edit</a>
                <a href="/back" @click=${navigationHandler} class="btn edit">Back</a>
            </div>
        </div>
    </div>
`;