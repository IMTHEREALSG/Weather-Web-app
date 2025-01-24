import axios from 'axios';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



export default function SearchBar({query,setQuery,weather,setWeather}) {
    
    const search = async (e) => {
        e.preventDefault();
        setWeather({...weather, loading: true});
        const api = import.meta.env.VITE_WEATHER_API;
        
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api}&units=metric`;
        try {
            const res = await axios.get(url);
            setWeather({loading: false, data: res.data, error: false});
        } catch(err) {
            setWeather({loading: false, data: {}, error: true});
        }
    }

    return (
         <div className="flex m-2 gap-2">
            <input 
            type="text"
            placeholder="Enter City Name"
            className="px-4 py-2 w-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            />
            <button onClick={search} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"><FontAwesomeIcon icon={faSearch} className="w-4 h-4" />Search</button>
         </div>
    )
}