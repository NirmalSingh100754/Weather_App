import React, { useState } from "react";
import SearchIcon from "./SearchIcon.svg";
import "./Weather.css";

const Weather = () => {
  const [details, setdetails] = useState({
    maxtemp: null,
    mintemp: null,
    humidity: null,
    wind: null,
  });
  const [bgim, set_bgim] = useState("./images/clear_sky.jpg");
  async function fetchAPI() {
    try {
      let city = document.getElementById("city").value;
      if (city == "") throw new Error("Enter a valid city name");
      const api_key = "adc390e108e66ab3771e17adab3aec79";
      const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
      const response = await fetch(api_url);
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      console.log(data);

      setdetails({
        maxtemp: (data.main.temp_max - 273).toFixed(0),
        mintemp: (data.main.temp_min - 273).toFixed(0),
        humidity: data.main.humidity,
        wind: data.wind.speed.toFixed(0),
      });

      const images = {
        "clear sky": "clear_sky.jpg",
        "few clouds": "few_clouds.jpg",
        "scattered clouds": "scattered_clouds.jpg",
        "broken clouds": "broken_clouds.jpg",
        "shower rain": "shower_rain.jpg",
        "rain": "rain.jpg",
        "thunderstorm": "thunderstorm.jpg",
        "snow": "snow.jpg",
        "mist": "mist.jpg",
      };

      const desc = data.weather[0].description.toLowerCase();
      set_bgim(`./images/${images[desc] || "clear_sky.jpg"}`);
    } catch (error) {
      alert("Some error occurred");
    }
  }
  return (
    <div className="weather" style={{ backgroundImage: `url(${bgim})` }}>
      <div className="mini-display">
        <h1>8°C</h1>
      </div>
      <div className="display">
        <div className="search">
          <input type="text" placeholder="Enter city" id="city" />
          <button>
            <img src={SearchIcon} alt="Search" onClick={fetchAPI} />
          </button>
        </div>
        <div className="line"></div>
        <h2>Weather Detail</h2>
        <div className="weather-detail">
          <div className="weather_detail">
            <p> Max Tempreture</p>
            <p> Min Tempreture</p>
            <p> Humidity</p>
            <p> Wind</p>
          </div>
          <div className="weather-values">
            <p>{details.maxtemp}°C</p>
            <p>{details.mintemp}°C</p>
            <p>{details.humidity}%</p>
            <p>{details.wind}%</p>
          </div>
        </div>
        <div className="line"></div>
        <h2>Weather Forecast</h2>
        <div className="weather_forecast"></div>
      </div>
    </div>
  );
};

export default Weather;
