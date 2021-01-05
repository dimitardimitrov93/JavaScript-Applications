import { render } from '../node_modules/lit-html/lit-html.js';
import authService from './services/authService.js';
import articleService from './services/articleService.js';

import layout from './views/layout.js';
import homeTemplate from './views/homeTemplate.js';
import loginTemplate from './views/loginTemplate.js';
import registerTemplate from './views/registerTemplate.js';
import createTemplate from './views/createTemplate.js';
import notFoundTemplate from './views/notFoundTemplate.js';
import articleDetails from './views/articleDetails.js';
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

        getData: articleService.getAll,
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

    {
        path: '\/details\/(?<id>.{20})',
        template: articleDetails,
        getArticle: articleService.getArticle,
        context: {},
    },
];

const router = (path) => {
    history.pushState({}, '', path);

    const route = routes.find(x => new RegExp(`^${x.path}$`, 'i').test(path));
    const template = route ? route.template : notFoundTemplate;
    let context = route.context;

    const userData = authService.getData();

    if (route.getData) {
        route.getData()
            .then(articles => {
                render(layout(template, { navigationHandler, ...userData, articles }), document.getElementById('root'));
            });
    } else if (route.getArticle) {
        const articleId = Array.from(path.matchAll(new RegExp(route.path, 'ig')))[0].groups.id;
        route.getArticle(articleId)
            .then(article => {
                render(layout(template, { navigationHandler, ...userData, article, articleId }), document.getElementById('root'));
            });
    }

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