function attachEvents() {
    const locationInputElement = document.getElementById('location');
    const submitButtonElement = document.getElementById('submit');
    const forecastDivElement = document.getElementById('forecast');
    const currentWeatherDivElement = document.getElementById('current');
    const upcomingWeatherDivElement = document.getElementById('upcoming');

    const baseUrl = `https://judgetests.firebaseio.com/locations.json`;
    const degreesIcon = '&#176';

    const errSpanElement = document.createElement('span');
    errSpanElement.innerHTML = 'Error';
    errSpanElement.style.width = '7%';
    errSpanElement.style.display = 'block';
    errSpanElement.style.fontSize = '2em';
    errSpanElement.style.margin = '0 auto';

    submitButtonElement.addEventListener('click', () => {
        if (!locationInputElement.value || locationInputElement.value.trim() === '')  {
            locationInputElement.value = '';
            displayError();
        }

        let inputLocation;

        if (locationInputElement.value.includes(' ')) {
            inputLocation = locationInputElement.value
            .trim()
            .split(' ')
            .map(x => `${x[0].toUpperCase()}${x.slice(1).toLowerCase()}`)
            .join(' ');
        } else {
            inputLocation = locationInputElement.value[0].toUpperCase() + locationInputElement.value.slice(1).toLowerCase();
        }

        locationInputElement.value = '';

        getWeatherData(inputLocation)
            .then(forecastData => {
                if (forecastDivElement.lastChild === errSpanElement) clearError();

                const [todayForecast, upcomingDaysForecast] = forecastData;
                
                displayTodaysWeather(todayForecast);
                displayUpcomingDaysWeather(upcomingDaysForecast);
            })
            .catch(err => {
                displayError();
            });
    });

    async function getWeatherData(inputLocation) {
        let locationCode;
        const locationResponse = await fetch(baseUrl);
        const locations = await locationResponse.json();

        locations.forEach(location => {
            if (location.name === inputLocation) {
                locationCode = location.code;
            }
        });

        const currentConditionsRequest = fetch(`https://judgetests.firebaseio.com/forecast/today/${locationCode}.json`);
        const upcomingConditionsRequest = fetch(`https://judgetests.firebaseio.com/forecast/upcoming/${locationCode}.json`);

        const currentConditionsResponse = await currentConditionsRequest;
        const upcomingConditionsResponse = await upcomingConditionsRequest;

        const currentConditions = await currentConditionsResponse.json();
        const upcomingConditions = await upcomingConditionsResponse.json();

        return [currentConditions, upcomingConditions];
    }

    function getConditionIcon(conditionText) {
        let conditionIconHtmlCode;
        switch (conditionText) {
            case 'Sunny':
                conditionIconHtmlCode = '&#x2600'
                break;
            case 'Partly sunny':
                conditionIconHtmlCode = '&#x26C5'
                break;
            case 'Overcast':
                conditionIconHtmlCode = '&#x2601'
                break;
            case 'Rain':
                conditionIconHtmlCode = '&#x2614'
                break;
        }

        return conditionIconHtmlCode;
    }

    function displayTodaysWeather(todayForecast) {
        currentWeatherDivElement.innerHTML = '<div class="label">Current conditions</div>';
        const todayForecastDivElement = document.createElement('div');
        const conditionDataSpan = document.createElement('span');

        todayForecastDivElement.classList.add('forecasts');
        conditionDataSpan.classList.add('condition');

        todayForecastDivElement.innerHTML = `<span class="condition symbol">${getConditionIcon(todayForecast.forecast.condition)}</span>`;

        conditionDataSpan.innerHTML = `
        <span class="forecast-data">${todayForecast.name}</span>
        <span class="forecast-data">${todayForecast.forecast.low}${degreesIcon}/${todayForecast.forecast.high}${degreesIcon}</span>
        <span class="forecast-data">${todayForecast.forecast.condition}</span>    
        `
        todayForecastDivElement.appendChild(conditionDataSpan);
        currentWeatherDivElement.appendChild(todayForecastDivElement);
        forecastDivElement.style.display = 'block';
    }

    function displayUpcomingDaysWeather(upcomingDaysForecast) {
        upcomingWeatherDivElement.innerHTML = '<div class="label">Three-day forecast</div>';
        const forecastInfoDiv = document.createElement('div');
        forecastInfoDiv.classList.add('forecast-info');
        
        upcomingDaysForecast.forecast.forEach(day => {
            const upcomingSpan = document.createElement('span');
            upcomingSpan.classList.add('upcoming');
            upcomingSpan.innerHTML = `
            <span class="symbol">${getConditionIcon(day.condition)}</span>
            <span class="forecast-data">${day.low}${degreesIcon}/${day.high}${degreesIcon}</span>
            <span class="forecast-data"">${day.condition}</span>
            `
            forecastInfoDiv.appendChild(upcomingSpan);
        });

        upcomingWeatherDivElement.appendChild(forecastInfoDiv);
    }

    function displayError() {
        currentWeatherDivElement.style.display = 'none';
        upcomingWeatherDivElement.style.display = 'none';
        forecastDivElement.style.display = 'block';
        forecastDivElement.appendChild(errSpanElement);
    }

    function clearError() {
        forecastDivElement.removeChild(errSpanElement);
        currentWeatherDivElement.style.display = 'block';
        upcomingWeatherDivElement.style.display = 'block';
    }
}

attachEvents();