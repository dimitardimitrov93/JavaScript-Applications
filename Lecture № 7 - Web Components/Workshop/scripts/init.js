import { Router } from 'https://unpkg.com/@vaadin/router';
import { logOut } from '../services/authServices.js';
import Home from '/components/home.js';
import Register from '/components/register.js';
import Login from '/components/login.js';
import Movies from '/components/movies.js';
import MovieCard from '/components/movie-card.js';
import MovieDetails from '/components/movie-details.js';

customElements.define('home-component', Home);
customElements.define('register-component', Register);
customElements.define('login-component', Login);
customElements.define('movies-component', Movies);
customElements.define('movie-card-component', MovieCard);
customElements.define('movie-details-component', MovieDetails);

const root = document.getElementById('root');
const router = new Router(root);

router.setRoutes([
    { path: '/', component: 'home-component' },
    { path: '/register', component: 'register-component' },
    { path: '/login', component: 'login-component' },
    { path: '/details/:movieId', component: 'movie-details-component' },
    {path: '/logout', action: (context, commands) => {
        logOut();
        return commands.redirect('/');
      }},
]);