const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";

// First, get the latitude and longitude for the city
const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

// Call getWeather API when the button is clicked
function getWeatherDescription(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  return fetch(weatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network Error');
      }
      return response.json();
    })
    .then(data => {
      // Return the first weather description
      return data.weather[0].description;
    })
    .catch(error => {
      console.error('Error getting weather description:', error);
      return null; 
    });
}

var weatherResult = document.getElementById("weatherResult");
//weatherResult.textContent = getWeatherDescription(51.7520, 1.2577);
getWeatherDescription(51.7520, 1.2577).then(description => {
  weatherResult.textContent = description || 'No weather data available';
});