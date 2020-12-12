import { html, render } from 'https://unpkg.com/lit-html?module';
import { Router } from 'https://unpkg.com/@vaadin/router';
import { login } from '../services/authServices.js';
import notify from '../scripts/notify.js';

const template = (ctx) => html`
    <form class="text-center border border-light p-5" @submit=${ctx.onSubmit}>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" placeholder="Email" name="email"/>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" placeholder="Password" name="password"/>
        </div>
            
        <button type="submit" class="btn btn-primary">Login</button>
    </form>
`;

class Login extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    onSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        login(email, password)
            .then(res => {
                Router.go('/');
                notify('Successful login.', 'success');
            })
            .catch(error => {
                let errorMessage = error.message
                    .replace(new RegExp(/_/g), ' ')
                    .split(' ')
                    .map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`)
                    .join(' ');

                notify(`${errorMessage}.`, 'error');
            });
    }

    render() {
        render(template(this), this, { eventContext: this });
    }
}

export default Login;