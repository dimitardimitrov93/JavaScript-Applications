import { html } from '../../node_modules/lit-html/lit-html.js';
import headerTemplate from './headerTemplate.js';
import footerTemplate from './footerTemplate.js';

export default (children, props) => html`
    ${headerTemplate(props)}

    ${children(props)}

    ${footerTemplate()}
`;