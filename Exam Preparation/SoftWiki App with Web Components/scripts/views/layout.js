import { html } from '../../node_modules/lit-html/lit-html.js';
import headerTemplate from './headerTemplate.js';
import registerTemplate from './registerTemplate.js';
import footerTemplate from './footerTemplate.js';

export default (children) => html`
    ${headerTemplate()}

    ${children}

    ${footerTemplate()}
`;