let map;

 async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDdA8vOAJ60APwKeH0r0PYcaYaZ2KR48i4&callback=initMap">

function initMap() {
  const saCenter = { lat: -34.9285, lng: 138.6007 }; // Adelaide as center

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: saCenter,
  });

}

// === Autocomplete restricted to South Australia ===
// Called when user clicks Search
function searchCampsite() {
    const searchText = document.getElementById("search-input").value;
  
    if (!searchText) {
      alert("Please enter a campsite name.");
      return;
    }
  
    const geocoder = new google.maps.Geocoder();
  
    geocoder.geocode({ address: searchText + ", South Australia" }, async (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
  
        // Center and zoom the map
        map.setCenter({ lat, lng });
        map.setZoom(10);
  
        // Add marker
        new google.maps.Marker({
          map,
          position: { lat, lng },
        });
  
        // Fetch weather
        await fetchWeather(lat, lng, results[0].formatted_address);
      } else {
        alert("Could not find that campsite in South Australia.");
      }
    });
  }
  
  // Fetch weather from OpenWeather
  async function fetchWeather(lat, lon, locationName) {
    const apiKey = "caa76137f6a82b8fe41a1ee3d094a30f"; // Replace this with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      const weatherHTML = `
        <h3>Weather in ${locationName}</h3>
        <p><strong>${data.weather[0].main}</strong>: ${data.weather[0].description}</p>
        <p>🌡️ Temp: ${data.main.temp} °C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind: ${data.wind.speed} m/s</p>
      `;
  
      document.getElementById("weather-info").innerHTML = weatherHTML;
    } catch (err) {
      console.error(err);
      document.getElementById("weather-info").innerHTML = "Failed to load weather info.";
    }
  }
