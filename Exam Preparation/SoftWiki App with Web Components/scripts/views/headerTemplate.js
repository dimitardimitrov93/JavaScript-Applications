import { html } from '../../node_modules/lit-html/lit-html.js';
import { logOut } from '../eventListeners.js';

export default ({ navigationHandler, isAuthenticated, email }) => html`
    <header @click=${navigationHandler}>
        <h1><a class="home" href="/">SoftWiki</a></h1>
        <nav class="nav-buttons">
            ${isAuthenticated
                ? html`
                    <a href="/create">Create</a>
                    <a href="#" @click=${logOut}>Logout</a>
                `
                : html`
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                `
            }
        </nav>
    </header>
`;