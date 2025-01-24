export default function ForecastCard({forecast, formatDay, isCelsius}){
    if (!forecast || !forecast.dt) return null;

    const convertTemp = (temp) => {
        if (isCelsius) {
            return Math.round(temp);
        }
        return Math.round((temp * 9/5) + 32);
    };

    return(
        <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="font-semibold text-lg text-gray-800 mb-2">
                {formatDay(forecast.dt)}
            </div>
            <div className="flex flex-col items-center">
                <img 
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} 
                    alt="daily-img" 
                    className="w-16 h-16 mb-2"
                />
                <div className="text-xl font-bold text-gray-900">
                    {convertTemp(forecast.main.temp_min)}{isCelsius ? "°C" : "°F"}/
                    {convertTemp(forecast.main.temp_max)}{isCelsius ? "°C" : "°F"}
                </div>
                <div className="text-sm text-gray-700 capitalize mt-1">
                    {forecast.weather[0].description}
                </div>
            </div>
        </div>
    );
}