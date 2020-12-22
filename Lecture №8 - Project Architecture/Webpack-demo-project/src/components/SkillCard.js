class SkillCard extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <li>${this.getAttribute('skill')}</li>
        `;
    }
}

export default SkillCard;