import { html } from '../../node_modules/lit-html/lit-html.js';
import articleSection from './articleSection.js';

export default ({ getAll }) => html`
    <div class="content">
        ${getAll()
            .then(articles => articles.map(article => articleSection(article)).join(''))
        }
    </div>
`;