    const API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
    // First, get the latitude and longitude for the city
    const getCoordinates=()=>{
        const city=document.getElementById("city").value;
        if (!city) {
        console.log("Please enter a city name");
        return;
    }
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        console.log("Geo URL:", geoUrl);
        fetch(geoUrl)
            .then(response=>response.json())
            .then(data=>{
                if(data.length===0){
                    console.log("City not found!")
                    return;
                }
            const {lat, lon, name}=data[0];
            console.log("Coordinates:", lat, lon);
            console.log("City:", name);
         })
    .catch(error=> console.error("Error finding location!", error));
    
    
};
document.getElementById("getWeather").addEventListener("click", getCoordinates);


