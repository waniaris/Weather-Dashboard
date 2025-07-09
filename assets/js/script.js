const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
const forecastUrl = `https://openweathermap.org/forecast16`;

// First, get the latitude and longitude for the city
const getCoordinates=()=>{
    const city=document.getElementById("city").value;
    if (!city) {
      console.log("Please enter a city name");
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent = "Please enter a city name";
      errorMessage.classList.remove("d-none");
      return Promise.resolve(null);
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
          const errorMessage = document.getElementById("errorMessage");
          errorMessage.classList.add("d-none");

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

// fetch Weather Data, returns date, description and temperature
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
      //modify fetchWeatherData to return 3 objects { date, description, temp } because we want both values.
      return {
        dateApi: data.dt_txt,
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

function toUpFirstLetter(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Get weather result
const weatherResult = () =>
  getCoordinates()
    .then(coordinates => {
      if (coordinates) {
        var descriptionResult = document.getElementById("descriptionResult");
        var locationResult = document.getElementById("locationResult");
        var temperatureResult = document.getElementById("temperatureResult");
        var city = document.getElementById("city").value.trim().toUpperCase();
        const iconImg = document.getElementById("weatherIcon");
        var bgImage = document.getElementsByClassName("bg-image");
        
        
        const dates = [
          document.getElementById("dayResult1"),
          document.getElementById("dayResult2"),
          document.getElementById("dayResult3"),
          document.getElementById("dayResult4"),
          document.getElementById("dayResult5")
        ];

        const temps = [
          document.getElementById("temperatureResult1"),
          document.getElementById("temperatureResult2"),
          document.getElementById("temperatureResult3"),
          document.getElementById("temperatureResult4"),
          document.getElementById("temperatureResult5")
        ];

        const descs = [
          document.getElementById("descriptionResult1"),
          document.getElementById("descriptionResult2"),
          document.getElementById("descriptionResult3"),
          document.getElementById("descriptionResult4"),
          document.getElementById("descriptionResult5")
        ];

        const icons = [
          document.getElementById("iconResult1"),
          document.getElementById("iconResult2"),
          document.getElementById("iconResult3"),
          document.getElementById("iconResult4"),
          document.getElementById("iconResult5")
        ];

        fetchWeatherData(coordinates.latApi, coordinates.lonApi, coordinates.countryApi)
          .then(result => {
            descriptionResult.textContent = toUpFirstLetter(result?.descApi) || 'No weather data available';
            locationResult.textContent = toUpFirstLetter(city) + ", " + coordinates.countryApi;
            temperatureResult.textContent = result?.tempApi != null ? result.tempApi + " °C" : 'N/A';
            iconImg.src = `assets/images/Icons/${result.iconApi}.png`;
            iconImg.alt = result.descApi;
            bgImage[0].style.background=`url('assets/images/Backgrounds/${result.iconApi}.jpg')`;
          });

        // fetchWeatherData5Day(coordinates.latApi, coordinates.lonApi)
        //   .then(result => {
        //     console.log(result)
        //     })
        //   .then(
        //     t1.textContent(result[0].tempApi)      
        //   );
        
        fetchWeatherData5Day(coordinates.latApi, coordinates.lonApi)
          .then(result => {
            if (!result) return;

            result.forEach((day, i) => {
              if (dates[i]) {

                const forecastDate = new Date(day.date);
                const weekday = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
                const monthDay = forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                dates[i].innerHTML = `${weekday}<br>${monthDay}`;
                
              }

              if (temps[i]) temps[i].textContent = `${Math.round(day.tempApi)} °C`;
              if (descs[i]) descs[i].textContent = toUpFirstLetter(day.descApi);
              if (icons[i]) icons[i].src = `assets/images/Icons/${day.iconApi}.png`;
            });
          });

      } else {
        console.log("Coordinates could not be found.")
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "City not found. Please enter a valid city.";
        errorMessage.classList.remove("d-none");
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent = "City not found. Please enter a valid city.";
      errorMessage.classList.remove("d-none");
      return null; 
    });

function fetchWeatherData5Day(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  return fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network Error');
      }
      return response.json();
    })
    .then(data => {
      // Filter forecast entries for 12:00:00 each day
      const dailyAtNoon = data.list.filter(entry =>
        entry.dt_txt.includes("12:00:00")
      ).slice(0, 5); // Get first 5 days only

      // Map to simplified forecast objects
      return dailyAtNoon.map(entry => ({
        date: entry.dt_txt,
        tempApi: entry.main.temp,
        descApi: entry.weather[0].description,
        iconApi: entry.weather[0].icon
      }));
    })
    .catch(error => {
      console.error('Error fetching 5-day forecast:', error);
      return null;
    });
}

// Updated event listener to use weatherResult
document.getElementById("getWeather").addEventListener("click", weatherResult);