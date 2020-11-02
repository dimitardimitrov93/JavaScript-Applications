function solve() {
    const infoSpanElement = document.querySelector('span.info')
    const departButton = document.getElementById('depart');
    const arriveButton = document.getElementById('arrive');

    let url = `https://judgetests.firebaseio.com/schedule/depot.json`;
    let currentStop;

    function depart() {
        fetch(url)
            .then(response => response.json())
            .then(stopId => {
                currentStop = stopId.name;
                infoSpanElement.innerHTML = `Next stop ${currentStop}`;
                url = `https://judgetests.firebaseio.com/schedule/${stopId.next}.json`;
                departButton.disabled = true;
                arriveButton.disabled = false;
            })
            .catch(err => {
                infoSpanElement.innerHTML = 'Error';
                departButton.disabled = true;
                arriveButton.disabled = true;
            })
    }

    function arrive() {
        infoSpanElement.innerHTML = `Arriving at ${currentStop}`;;
        departButton.disabled = false;
        arriveButton.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();