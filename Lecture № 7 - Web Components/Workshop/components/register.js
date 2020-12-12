import { html, render } from 'https://unpkg.com/lit-html?module';
import { register } from '../services/authServices.js';
import { Router } from 'https://unpkg.com/@vaadin/router';
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

        <div class="form-group">
            <label for="repeatPassword">Repeat Password</label>
            <input type="password" class="form-control" placeholder="Repeat-Password" name="repeatPassword"/>
        </div>

        <button type="submit" class="btn btn-primary">Register</button>
    </form>
`;

class Register extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    onSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const repeatPassword = formData.get('repeatPassword');

        if (!email.trim()) {
            notify('The email input must be filled.', 'error');
            return;
        } else if (password !== repeatPassword) {
            notify('Password mismatch.', 'error');
            return;
        } else if (password.length < 6) {
            notify('The password should be at least 6 characters long.', 'error');
            return;
        }

        register(email, password)
            .then(res => {
                Router.go('/');
                notify('Successful registration.', 'success');
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

export default Register;