import React, { useEffect, useState } from "react";
import humidity from "./humidity.svg";
import SearchIcon from "./SearchIcon.svg";
import tempmax from "./tempmax.svg";
import tempmin from "./tempmin.svg";
import "./Weather.css";
import wind from "./wind.svg";

const Weather = () => {
  const [details, setDetails] = useState({
    maxtemp: 0.0,
    mintemp: 0.0,
    humidity: 0,
    wind: 0,
    currtemp: 0,
    city_name: "NA",
    description: "NA",
    icon: "NA",
  });

  const [forecast, setForecast] = useState([]);
  const [bgim, setBgim] = useState("./images/clear_sky.jpg");
  const [dateTime, setDateTime] = useState("");

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const timeString = date.toLocaleTimeString([], options);

    if (date >= today && date < tomorrow) {
      return `Today at ${timeString}`;
    } else if (
      date >= tomorrow &&
      date <
        new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate() + 1
        )
    ) {
      return `Tomorrow at ${timeString}`;
    } else {
      return date.toLocaleDateString() + " at " + timeString;
    }
  };

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
      const arricon = [],
        arrtemp = [],
        arrdesc = [],
        dt_txt = [];
      for (let i = 0; i < 40; i++) {
        arricon.push(
          `https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}.png`
        );
        arrtemp.push((forecastData.list[i].main.temp - 273).toFixed(0));
        arrdesc.push(forecastData.list[i].weather[0].description);
        dt_txt.push(formatDate(forecastData.list[i].dt));
      }

      setForecast({
        icon: arricon,
        temp: arrtemp,
        description: arrdesc,
        dt_txt: dt_txt,
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
        "scattered clouds": "scattered_cloud.jpg",
        "broken clouds": "broken_clouds.jpg",
        "overcast clouds": "broken_clouds.jpg",
        "shower rain": "shower_rain.jpg",
        rain: "rain.jpg",
        thunderstorm: "thunderstorm.jpg",
        snow: "snow.jpg",
        mist: "mist.jpg",
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
          <h5>{details.city_name}</h5>
          <p>{dateTime}</p>
        </div>
        <div className="div3">
          <img src={details.icon} alt="NA" />
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
            <p>
              {details.maxtemp}°C <img src={tempmax} alt="" />{" "}
            </p>
            <p>
              {details.mintemp}°C
              <img src={tempmin} alt="" />
            </p>
            <p>
              {details.humidity}%<img src={humidity} alt="" />
            </p>
            <p>
              {details.wind}k/h <img src={wind} alt="" />
            </p>
          </div>
        </div>
        <div className="line"></div>
        <h2>Weather Forecast</h2>
        <div className="weather_forecast">
          {forecast.icon?.slice(0, 40).map((icon, index) => (
            <div className="wf" key={index}>
              <div className="wf1">
                <img src={icon} alt="Weather icon" />
              </div>
              <div className="date-time">
                <p>{forecast.dt_txt ? forecast.dt_txt[index] : ""}</p>
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
