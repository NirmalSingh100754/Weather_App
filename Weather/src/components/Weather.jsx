import SearchIcon from "./SearchIcon.svg";
import "./Weather.css";
const api_key = "adc390e108e66ab3771e17adab3aec79";
const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`;
const Weather = () => {
  async function fetchAPI() {
    try {
      let city=document.getElementById('city').value;
      if(city=="")
        throw new Error("Enter a valid city name");
    } catch (error) {
      alert(error.message);
    }
    const response = await fetch(api_url);
    const data = await response.json();
    console.log(data);
  }
  return (
    <div className="weather">
      <div className="display">
        <div className="search">
          <input type="text" placeholder="Enter city" id="city" />
          <button>
            <img src={SearchIcon} alt="Search" onClick={fetchAPI} />
          </button>
        </div>
        <div className="line"></div>
        <div className="weather_detail">
          <h2>Weather Detail</h2>
          <p> Max Tempreture</p>
          <p> Min Tempreture</p>
          <p> Humidity</p>
          <p> Wind</p>
        </div>
        <div className="line"></div>
        <div className="weather_forecast">
          <h2>Weather Forecast</h2>
        </div>
      </div>
    </div>
  );
};

export default Weather;
