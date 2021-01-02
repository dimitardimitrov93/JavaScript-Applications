import { render } from '../node_modules/lit-html/lit-html.js';
import layout from './views/layout.js';
import homeTemplate from './views/homeTemplate.js';
import loginTemplate from './views/loginTemplate.js';
import registerTemplate from './views/registerTemplate.js';

const routes = [
    {
        path: '/',
        template: homeTemplate,
    },

    {
        path: '/login',
        template: loginTemplate,
    },

    {
        path: '/register',
        template: registerTemplate,
    },
];

const router = (path) => {
    const route = routes.find(x => x.path === path);
    const template = route ? route.template : homeTemplate;

    render(layout(template()), document.getElementById('root'));
};

router(location.pathname);