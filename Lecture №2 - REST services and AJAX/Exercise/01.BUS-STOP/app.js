function getInfo() {
    const stopIdInputElement = document.getElementById('stopId');
    const stopNameDivElement = document.querySelector('#stopName');
    const busesUlElement = document.querySelector('#buses');

    const url = `https://judgetests.firebaseio.com/businfo/${stopIdInputElement.value}.json`;
    
    stopIdInputElement.value = '';
    stopNameDivElement.innerHTML = '';
    busesUlElement.innerHTML = '';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            stopNameDivElement.textContent = data.name;
            busesUlElement.innerHTML = Object.entries(data.buses).map(x => `<li>Bus ${x[0]} arrives in ${x[1]} minutes</li>`).join('');
        })
        .catch(err => {
            stopNameDivElement.textContent = 'Error';
        });
}