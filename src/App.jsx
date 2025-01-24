import { useEffect, useState } from 'react';
import './App.css';
import backgroundImage from './assets/background.png';
import Forecast from './forecast';
import SearchBar from './components/SearchBar';
import axios from 'axios';

function App() {
  return (
    <div className='w-full min-h-screen'>
      <WeatherApp />
    </div>
  );
}

function WeatherApp() {
  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
      {/* Background Image Container */}
      <div className='fixed inset-0'>
        <img 
          src={backgroundImage} 
          alt="background" 
          className='w-screen h-screen object-cover'
        />
      </div>

      {/* Content Container */}
      <div className='relative z-10 flex flex-col items-center min-h-screen p-4'>
        <h1 className='text-5xl m-10 p-4 text-white font-bold text-shadow'>
          Welcome To Weather Info!!
        </h1>
        <div className='w-full max-w-4xl'>
          <WeatherCard />
        </div>
      </div>
    </div>
  );
}

function WeatherCard() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({
    loading: true,
    data: null,
    error: false,
  });

  useEffect(() => {
    const api = import.meta.env.VITE_WEATHER_API;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=${api}&units=metric`;
    
    const fetchData = async() => {
      try {
        const res = await axios.get(url);
        setWeather({loading: false, data: res.data, error: false});
      } catch(err) {
        setWeather({loading: false, data: null, error: true});
        console.error('Error fetching weather:', err);
      }
    }
    fetchData();
  }, []);

  if (weather.loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (weather.error) {
    return <div className="text-center text-red-500">Error loading weather data</div>;
  }

  return (
    <div className='bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl justify-center items-center flex flex-col'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Weather Card</h1>
      <SearchBar query={query} setQuery={setQuery} weather={weather} setWeather={setWeather}/>
      {weather.data && <Forecast weather={weather}/>}
    </div>
  );
}

export default App;