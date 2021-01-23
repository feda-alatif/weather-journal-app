const model = {
    inputSelectors: ['#zip', '#feelings'],
    origin: window.location.origin,
    weatherPath: '/weather',
    postPath: '/postdata'
};

const octopus = {
    init: () => {
        view.init();
    },

    getWeatherPath: () => model.weatherPath,

    getPostPath: () => model.postPath,

    generateNewDatetime: () => {
       
        let d = new Date();
        const hrs = d.getHours();
        const mins = d.getMinutes();
        const hrsFormatted = hrs < 10 ? '0' + hrs : hrs;
        const minsFormatted = mins < 10 ? '0' + mins : mins;

        return `${d.getMonth()+1}.${d.getDate()}.${d.getFullYear()} - ${hrsFormatted}:${minsFormatted}`;
    },

    getInputSelectors: () => {
        return model.inputSelectors;
    },

    getWeatherData: async (path = '') => {
        const response = await fetch(model.origin + path);
        try {
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('error: ', error);
            return error;
        }
    },

    postData: async (path = '', data = {}) => {
     
        const response = await fetch(model.origin + path, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        try {
            const newData = await response.json();
            return newData;
        } catch (error) {
            return error;
        }
    }
}

const view = {
    
    init: () => {
       
        document.addEventListener('DOMContentLoaded', () => {
            view.addEventListeners();
        })
    },

    
    getUserInputs: (selectors = [], reset = false) => {
        let inputs = {};
        
        const regex = new RegExp('^(#|.)');
        for (let selector of selectors) {
            const domEle = document.querySelector(selector);
            inputs[selector.replace(regex, '')] = domEle.value.trim();
            if(reset) {
                domEle.value = '';
            }
        }
        return inputs;
    },

    updateUI: (data) => {
        const date = octopus.generateNewDatetime();
        document.querySelector('#date').textContent = date;
        if (data && data.weather) {
            document.querySelector('#summary').textContent = 
                data.weather.weather[0].description || 'N/A';
            document.querySelector('#temp').textContent = 
                (data.weather.main.temp - 273.15).toFixed(2) + '°C';
            document.querySelector('#rh').textContent = 
                data.weather.main.humidity + '%';
            document.querySelector('#pressure').textContent = 
                data.weather.main.pressure + ' mbar';
            document.querySelector('#content').textContent = 
                data.feelings;
        }
    },

    showFeedback: (message, type) => {
        const errorDiv = document.querySelector('#feedback');
        errorDiv.textContent = message;
        errorDiv.classList.add(type);
       
        setTimeout(function() {
            errorDiv.textContent = '';
            errorDiv.classList.remove(type);
        }, 3000);
    },

    addEventListeners: () => {
        const submitButton = document.getElementById('generate');
        submitButton.addEventListener('click', (event) => {
            
            event.preventDefault();
            
            const selectors = octopus.getInputSelectors();
            const inputs = view.getUserInputs(selectors, true);
            
            octopus.getWeatherData(
                octopus.getWeatherPath() + '?zip=' + inputs.zip)
                .then((weatherData) => {
                    if(weatherData.error) {
                        view.showFeedback(weatherData.error, 'error');
                        return;
                    }
                    if (weatherData.cod === "404") {
                        view.showFeedback(weatherData.message, 'error');
                    }
                    octopus.postData(octopus.getPostPath(), inputs)
                        .then((data) => {
                            view.updateUI(data);
                        });
                });
        });
    }
}

octopus.init();
