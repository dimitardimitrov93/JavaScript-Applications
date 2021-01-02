import { html } from '../../node_modules/lit-html/lit-html.js';

export default () => html`
    <div class="container auth">
        <form>
            <fieldset>
                <legend>Register</legend>
                <blockquote>Knowledge is not simply another commodity. On the contrary. Knowledge is never used up. It increases by diffusion and grows by dispersion.</blockquote>
                <p class="field email">
                    <input type="email" id="email" name="email" placeholder="maria@email.com">
                    <label for="email">Email:</label>
                </p>
                <p class="field password">
                    <input type="password" name="password" id="register-pass">
                    <label for="register-pass">Password:</label>
                </p>
                <p class="field password">
                    <input type="password" name="rep-pass" id="rep-pass">
                    <label for="rep-pass">Repeat password:</label>
                </p>
                <p class="field submit">
                    <button class="btn submit" type="submit">Register</button>
                </p>
                <p class="field">
                    <span>If you already have profile click <a href="#">here</a></span>
                </p>
            </fieldset>
        </form>
    </div>
`;
