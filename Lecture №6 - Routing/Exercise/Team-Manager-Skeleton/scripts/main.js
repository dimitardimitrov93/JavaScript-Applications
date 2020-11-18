function attachEvents() {
    let counter = 0;
    window.addEventListener('hashchange', (e) => {
        const currentLocation = location.href.replace(`${location.origin}/#/`, '');
        console.log(`${++counter}`);
        
        if (currentLocation === 'login') {
            console.log(document.getElementById('username'));
            
        }
    }, false);
}

attachEvents();