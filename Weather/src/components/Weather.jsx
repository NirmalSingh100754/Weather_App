import React, { useEffect, useState } from "react";
import SearchIcon from "./SearchIcon.svg";
import "./Weather.css";

const Weather = () => {
  const [details, setDetails] = useState({
    maxtemp: null,
    mintemp: null,
    humidity: null,
    wind: null,
    currtemp: null,
    city_name: null,
    description: null,
    icon: null,
  });

  const [forecast, setForecast] = useState([]);
  const [bgim, setBgim] = useState("./images/clear_sky.jpg");
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const day = now.toLocaleString("en-US", { weekday: "long" });
      const date = now.getDate();
      const month = now.toLocaleString("en-US", { month: "short" });
      const year = now.getFullYear().toString().slice(-2);

      setDateTime(`${hours}:${minutes} - ${day}, ${date} ${month} '${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  async function fetchAPI() {
    try {
      let city = document.getElementById("city").value;
      if (city === "") throw new Error("Enter a valid city name");

      const api_key = "adc390e108e66ab3771e17adab3aec79";
      const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
      const forecastapi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;

      const response = await fetch(api_url);
      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      const forecastResponse = await fetch(forecastapi);
      const forecastData = await forecastResponse.json();
      const arrtime = [],
        arrtemp = [],
        arrdesc = [];
      for (let i = 0; i < 20; i++) {
        arrtime.push(
          `https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}.png`
        );
        arrtemp.push((forecastData.list[i].main.temp - 273).toFixed(0));
        arrdesc.push(forecastData.list[i].weather[0].description);
      }

      setForecast({
        time: arrtime,
        temp: arrtemp,
        description: arrdesc,
      });
      console.log(data);
      console.log(forecastData);

      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

      setDetails({
        maxtemp: (data.main.temp_max - 273).toFixed(0),
        mintemp: (data.main.temp_min - 273).toFixed(0),
        humidity: data.main.humidity,
        wind: data.wind.speed.toFixed(0),
        currtemp: (data.main.temp - 273).toFixed(0),
        city_name: city,
        description: data.weather[0].description,
        icon: iconUrl,
      });

      const images = {
        "clear sky": "clear_sky.jpg",
        "few clouds": "few_clouds.jpg",
        "scattered clouds": "scattered_clouds.jpg",
        "broken clouds": "broken_clouds.jpg",
        "overcast clouds": "broken_clouds.jpg",
        "shower rain": "shower_rain.jpg",
        "rain": "rain.jpg",
        "thunderstorm": "thunderstorm.jpg",
        "snow": "snow.jpg",
        "mist": "mist.jpg",
      };

      setBgim(
        `./images/${
          images[data.weather[0].description.toLowerCase()] || "clear_sky.jpg"
        }`
      );
    } catch (error) {
      alert("Some error occurred");
    }
  }

  return (
    <div className="weather" style={{ backgroundImage: `url(${bgim})` }}>
      <div className="mini-display">
        <h1>{details.currtemp}°C</h1>
        <div className="div2">
          <h4>{details.city_name}</h4>
          <p>{dateTime}</p>
        </div>
        <div className="div3">
          <img src={details.icon} alt="icon not found" />
          <p>{details.description}</p>
        </div>
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
            <p> Max Temperature</p>
            <p> Min Temperature</p>
            <p> Humidity</p>
            <p> Wind</p>
          </div>
          <div className="weather-values">
            <p>{details.maxtemp}°C</p>
            <p>{details.mintemp}°C</p>
            <p>{details.humidity}%</p>
            <p>{details.wind} km/h</p>
          </div>
        </div>
        <div className="line"></div>
        <h2>Weather Forecast</h2>
        <div className="weather_forecast">
          {forecast.time?.slice(0, 20).map((icon, index) => (
            <div className="wf" key={index}>
              <div className="">
                <img src={icon} alt="Weather icon" />
                <p>{forecast.description ? forecast.description[index] : ""}</p>
              </div>
              <p>{forecast.temp[index]}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
