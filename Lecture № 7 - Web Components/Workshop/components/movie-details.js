
import { html, render } from 'https://unpkg.com/lit-html?module';
import { Router } from 'https://unpkg.com/@vaadin/router';
import { getMovie, likeMovie } from '../services/movieService.js';
import { getUserData } from '../services/authServices.js';

const template = (ctx) => html`
    <div class="container">
        <div class="row bg-light text-dark">
        <h1>Movie title: ${ctx.movieData.title}</h1>
            
            <div class="col-md-8">
                <img class="img-thumbnail" src="${ctx.movieData.imageUrl}" alt="Movie">
            </div>
            <div class="col-md-4 text-center">
                <h3 class="my-3 ">Movie Description</h3>
                <p>${ctx.movieData.description}</p>
                ${ctx.movieData.creator === ctx.user.email
        ? html`
                        <a class="btn btn-danger" href="/delete/${ctx.location.params.movieId}">Delete</a>
                        <a class="btn btn-warning" href="/edit/${ctx.location.params.movieId}">Edit</a>
                    `
        : ctx.movieData.peopleLiked.includes(ctx.user.email)
            ? html`
                            <span class="enrolled-span">Liked ${ctx.movieData.peopleLiked.includes('')
                    ? '0'
                    : ctx.movieData.peopleLiked.length
                }
                        </span>
                        `
            : html`
                            <a class="btn btn-primary" @click=${ctx.onlikeMovieClick}>Like</a>
                        `
    }
            </div>
        </div>
    </div>
`;

class MovieDetails extends HTMLElement {

    connectedCallback() {
        getMovie(this.location.params.movieId)
            .then(movieData => {
                this.movieData = movieData;
                this.render();
            });

        this.user = getUserData();
    }

    render() {
        render(template(this), this, { eventContext: this });
    }

    onlikeMovieClick(e) {
        e.preventDefault();
        let peopleLiked = this.movieData.peopleLiked.slice();
        peopleLiked.push(this.user.email);
        likeMovie(this.location.params.movieId, { peopleLiked })
            .then(res => {
                this.requestUpdate();
            });
    }
}

export default MovieDetails;