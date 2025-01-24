import { useState, useEffect } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import ForecastCard from "./components/forecast_card"

export default function Forecast({weather}) {
    const {data} = weather;
    const [forecast, setForecast] = useState([]);
    const [isCelsius, setIsCelsius] = useState(true);
    const cityName = weather?.data?.name;
    const country = weather?.data?.sys?.country;

    useEffect(() => {
        if (!data?.name) return; // Guard clause
        
        const api = import.meta.env.VITE_WEATHER_API;
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${api}&units=metric`;
        
        const fetchData = async() => {
            try {
                const res = await axios.get(url);
               
                if (res.data && res.data.list) {
                    setForecast(res.data.list);
                }
            } catch(err) {
                console.error('Error fetching forecast:', err);
                setForecast([]);
            }
        }
        fetchData();
    }, [data?.name]);

    const formatDay = (date) => {
        const options = { weekday: "short" };
        const d = new Date(date * 1000);
        return d.toLocaleDateString("en-US", options);
    };

    const getCurrentDate = () => {
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      const currentDate = new Date().toLocaleDateString("en-US", options);
      return currentDate;
    };

    const rendertemp = (temp) => {
        if (isCelsius) {
            return Math.round(temp); // Already in Celsius
        }
        return Math.round((temp * 9/5) + 32); // Convert Celsius to Fahrenheit
    }

    const filterDailyForecasts = (forecastList) => {
        if (!Array.isArray(forecastList)) return [];
        
        const dailyForecasts = {};
        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = forecast;
            }
        });
        
        const result = Object.values(dailyForecasts).slice(0, 5);
        return result;
    };

    if (!data || !data.weather) {
        return <div>Loading...</div>;
    }

    return (
        <div className="text-center p-4">
            <div className="text-2xl font-bold mb-2">{cityName}, {country}</div>
            <div className="text-lg mb-4">{getCurrentDate()}</div>
            <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                    src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt={data.weather[0].description}
                    className="w-16 h-16"
                />
                <div className="text-4xl">
                    {rendertemp(data.main.temp)}
                    <sup 
                        onClick={() => setIsCelsius(prev => !prev)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                    >
                        {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
                    </sup>
                </div>
            </div>
            <div className="text-lg mb-4 capitalize">{data.weather[0].description}</div>
            <div className="grid grid-cols-3 gap-x-16 m-5">
                <div className="flex items-center">
                    <ReactAnimatedWeather icon="WIND" size={40}/>
                    <div>
                        <p className="font-bold">{data.wind.speed}m/s</p>
                        <p>Wind Speed</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <ReactAnimatedWeather icon="CLEAR_DAY" size={40}/>
                    <div>
                        <p className="font-bold">{data.main.pressure}hPa</p>
                        <p>Pressure</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <ReactAnimatedWeather icon="RAIN" size={40}/>
                    <div>
                        <p className="font-bold">{data.main.humidity}%</p>
                        <p>Humidity</p>
                    </div>
                </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">5-Day Forecast:</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {forecast && forecast.length > 0 ? (
                    filterDailyForecasts(forecast).map((forecastItem) => {
                        return (
                            <ForecastCard 
                                key={forecastItem.dt}
                                forecast={forecastItem} 
                                formatDay={formatDay} 
                                isCelsius={isCelsius}
                            />
                        );
                    })
                ) : (
                    <div className="col-span-5 text-center text-gray-500">
                        No forecast data available
                    </div>
                )}
              </div>
            </div>
        </div>
    );
}