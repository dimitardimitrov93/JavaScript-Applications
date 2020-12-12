import {Router} from 'https://unpkg.com/@vaadin/router';

const root = document.getElementById('root');
const router = new Router(root);

router.setRoutes([
  {path: '/', component: 'home-component'},
  {path: '/register', component: 'register-component'},
  {path: '/login', component: 'login-component'},
  {path: '/logout', component: 'logout-component'},
]);