const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
//const forecastUrl = `https://openweathermap.org/forecast16`;

// First, get the latitude and longitude for the city
const getCoordinates=()=>{
    const city=document.getElementById("city").value;
    if (!city) {
      console.log("Please enter a city name");
      return;
    }
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        //console.log("Geo URL:", geoUrl);
        return fetch(geoUrl) 
        .then(response => response.json())
        .then(data => {
          if (data.length === 0) {
            console.log("City not found!");
            return null;
          }
          const { lat, lon, name, country } = data[0];
          console.log("Coordinates:", lat, lon);
          console.log("City:", name);
          return { latApi: lat, lonApi: lon, countryApi:country };
    })
    .catch(error => {
      console.error("Error finding location!", error);
      return null;
    });    
    
};

// fetchWeatherData returns description and temperature
function fetchWeatherData(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  return fetch(weatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network Error');
      }
      return response.json();
    })
    .then(data => {
      //modify fetchWeatherData to return 2 objects { description, temp } because we want both values.
      return {
        descApi: data.weather[0].description,
        tempApi: data.main.temp,
        iconApi: data.weather[0].icon
      };
    })
    .catch(error => {
      console.error('Error getting weather description:', error);
      return null; 
    });
}
// var iconImg = document.getElementById("weatherIcon");

// // if (result) {
// //   descriptionResult.textContent = toUpFirstLetter(result.descApi);
// // //   locationResult.textContent = toUpFirstLetter(city) + ", " + coordinates.countryApi;
// // //   temperatureResult.textContent = `${result.tempApi} °C`;
  
// //   // Dynamically set icon
  //iconImg.src = `assets/images/Icons/${result.iconApi}.png`;
//   iconImg.alt = result.descApi;
// } else {
//   // Handle error
//    iconImg.src = "";
//   iconImg.alt = "No icon";
// // }

function toUpFirstLetter(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Renamed from descriptionResult to weatherResult
const weatherResult = () =>
  getCoordinates()
    .then(coordinates => {
      if (!coordinates) {
        console.log("Coordinates Not Found!");
        return;
      }
       const city = document.getElementById("city").value.trim().toUpperCase(); 
       var descriptionResult = document.getElementById("descriptionResult");
       var locationResult = document.getElementById("locationResult");
       var temperatureResult = document.getElementById("temperatureResult");
       const iconImg = document.getElementById("weatherIcon");
        
        fetchWeatherData(coordinates.latApi, coordinates.lonApi)
          .then(result => {
            if (!result) return;
            var iconImg = document.getElementById("weatherIcon");
             var iconImg = document.getElementById("weatherIcon");
            //update UI
            descriptionResult.textContent = toUpFirstLetter(result.descApi);
            locationResult.textContent = toUpFirstLetter(city) + ", " + coordinates.countryApi;
            temperatureResult.textContent = `${result.tempApi} °C`;
            iconImg.src = `assets/images/Icons/${result.iconApi}.png`;;
             iconImg.alt = result.descApi;
          
          });
        });
// Updated event listener to use weatherResult
document.getElementById("getWeather").addEventListener("click", weatherResult);
