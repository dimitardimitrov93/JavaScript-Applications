import { render } from '../node_modules/lit-html/lit-html.js';
import layout from './views/layout.js';
import homeTemplate from './views/homeTemplate.js';
import loginTemplate from './views/loginTemplate.js';
import registerTemplate from './views/registerTemplate.js';
import createTemplate from './views/createTemplate.js';
import notFoundTemplate from './views/notFoundTemplate.js';
import { onLoginSubmit } from './eventListeners.js';

const routes = [
    {
        path: '/',
        template: homeTemplate,
    },

    {
        path: '/login',
        template: loginTemplate,
        context: {
            onLoginSubmit,
        },
    },

    {
        path: '/register',
        template: registerTemplate,
    },

    {
        path: '/create',
        template: createTemplate,
    },
];

const router = (path) => {
    history.pushState({}, '', path);

    const route = routes.find(x => x.path === path);
    const template = route ? route.template : notFoundTemplate;
    const context = route.context;

    render(layout(template(context), { navigationHandler }), document.getElementById('root'));
};

function navigationHandler(e) {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const url = new URL(e.target.href);

        router(url.pathname);
    }
}

export default router;