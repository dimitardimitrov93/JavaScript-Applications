import { render } from '../node_modules/lit-html/lit-html.js';
import authService from './services/authService.js';
import articleService from './services/articleService.js';

import layout from './views/layout.js';
import homeTemplate from './views/homeTemplate.js';
import loginTemplate from './views/loginTemplate.js';
import registerTemplate from './views/registerTemplate.js';
import createTemplate from './views/createTemplate.js';
import notFoundTemplate from './views/notFoundTemplate.js';
import { onLoginSubmit, onRegisterSubmit, onCreatedArticleSubmit } from './eventListeners.js';

const routes = [
    {
        path: '/',
        template: (props) => {
            let template = homeTemplate;
            let url = '/';

            if (!props.isAuthenticated) {
                template = loginTemplate;
                url = '/login';
            }

            history.pushState({}, '', url);

            return template(props);
        },
        context: {
            getAll: articleService.getAll,
        }
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
        context: {
            onRegisterSubmit,
        }
    },

    {
        path: '/create',
        template: createTemplate,
        context: {
            onCreatedArticleSubmit,
        }
    },
];

const router = (path) => {
    history.pushState({}, '', path);

    const route = routes.find(x => x.path === path);
    const template = route ? route.template : notFoundTemplate;
    const context = route.context;

    const userData = authService.getData();

    render(layout(template, { navigationHandler, ...userData, ...context }), document.getElementById('root'));
};

function navigationHandler(e) {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const url = new URL(e.target.href);

        router(url.pathname);
    }
}

export default router;