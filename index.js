const apiKey = "0973b55d6f2b974f24dec48565c73baa";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchButt = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const spinner = document.querySelector(".spinner");
const clearBtn = document.querySelector(".clear-btn");

async function checkWeather(city) {
  spinner.style.display = "block";

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const weatherEl = document.querySelector(".weather");

    if (response.status == 404) {
      document.querySelector(".error").style.display = "block";
      weatherEl.style.display = "none";
    } else {
      const data = await response.json();

      document.querySelector(".city").innerHTML = data.name;
      document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
      document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
      document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

      switch (data.weather[0].main) {
        case "Clouds":
          weatherIcon.src = "images/clouds.png"; break;
        case "Clear":
          weatherIcon.src = "images/clear.png"; break;
        case "Rain":
          weatherIcon.src = "images/rain.png"; break;
        case "Drizzle":
          weatherIcon.src = "images/drizzle.png"; break;
        case "Mist":
          weatherIcon.src = "images/mist.png"; break;
        default:
          weatherIcon.src = ""; break;
      }

      weatherEl.classList.add("fade-in");
      weatherEl.style.display = "block";
      document.querySelector(".error").style.display = "none";

    
      localStorage.setItem("lastCity", city);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }

  spinner.style.display = "none";
}

searchButt.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city !== "") {
    checkWeather(city);
  }
});


window.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    checkWeather(lastCity);
  }
});


clearBtn.addEventListener("click", () => {
  localStorage.removeItem("lastCity");
  document.querySelector(".weather").style.display = "none";
  searchBox.value = "";
});


document.querySelector(".geo-btn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      spinner.style.display = "block";
      const response = await fetch(geoUrl);
      const data = await response.json();

      searchBox.value = data.name;
      checkWeather(data.name);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});
