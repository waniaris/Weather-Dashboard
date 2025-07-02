const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
const forecastUrl = `https://openweathermap.org/forecast16`;

// First, get the latitude and longitude for the city
const getCoordinates=()=>{
    const city=document.getElementById("city").value;
    if (!city) {
      console.log("Please enter a city name");
      return;
    }
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        console.log("Geo URL:", geoUrl);
        return fetch(geoUrl) // <--- RETURN this promise
        .then(response => response.json())
        .then(data => {
          if (data.length === 0) {
            console.log("City not found!");
            return null;
          }
          const { lat, lon, name } = data[0];
          console.log("Coordinates:", lat, lon);
          console.log("City:", name);
          return { latApi: lat, lonApi: lon };
    })
    .catch(error => {
      console.error("Error finding location!", error);
      return null;
    });    
    
};

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

const weatherResult = () =>
  getCoordinates()
    .then(coordinates => {
      if (coordinates) {
        var weatherResult = document.getElementById("weatherResult");
        //weatherResult.textContent = getWeatherDescription(51.7520, 1.2577);
        getWeatherDescription(coordinates.latApi, coordinates.lonApi)
          .then(description => {
            weatherResult.textContent = description || 'No weather data available';
          });

        //console.log(coordinates.latApi, " yyy ", coordinates.lonApi)
      } else {
        console.log("Coordinates could not be found.")
      }
    })




document.getElementById("getWeather").addEventListener("click", weatherResult);