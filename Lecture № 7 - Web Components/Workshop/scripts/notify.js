function notify(message, type) {
    const successBoxElement = document.getElementById('successBox');
    const errorBoxElement = document.getElementById('errorBox');
    let notificationElement = null;

    switch (type) {
        case 'success':
            notificationElement = successBoxElement;
            break;
        case 'error':
            notificationElement = errorBoxElement;
            break;
    }

    notificationElement.innerHTML = message;
    notificationElement.parentElement.style.display = 'block';

    setTimeout(() => {
        notificationElement.innerHTML = '';
        notificationElement.parentElement.style.display = 'none';
    }, 2000);
}

export default notify;