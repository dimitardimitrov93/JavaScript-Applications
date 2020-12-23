import './MessageComponent.css';

class MessageComponent extends HTMLElement {
    constructor() {
        super();
        this.skills = [
            'fast learner',
            'team player',
            'detail oriented',
            '+1',
        ];
    }

    template(skils) {
        return `
            <div class="message-component-container">
                <h3>List of Skills</h3>
                <ul>
                    ${skils.map(skill => `<skill-card skill="${skill}"></skill-card>`).join('')}
                </ul>
            </div>
        `;
    }
    
    connectedCallback() {
        this.innerHTML = this.template(this.skills);
    }
}

export default MessageComponent;