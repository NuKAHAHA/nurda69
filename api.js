const axios = require('axios');
const OPENWEATHER_KEY = "79429e941903ab8242cdd151cf7e1994";
const YOUR_RAPIDAPI_KEY = "68915ed042msh2b157ff89f4020dp14b020jsn76fe01fb6da0";
const NINJAAPI_KEY = "nXkTlJXyIQirAyAoHiiMKg==bRcQm71O6ebxf0s0";
const FTBLNEW_KEY = "68915ed042msh2b157ff89f4020dp14b020jsn76fe01fb6da0";



async function getWeatherByCity(city) {
    let response, responseData = null;
    try {
        response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${OPENWEATHER_KEY}`);
        responseData = response?.data;
    } catch {
        return null;
    }

    if (!responseData) {
        return null;
    }
    
    if (responseData.cod !== 200) {
        return null;
    }

    return {
        "latitude": responseData.coord.lat,
        "longitude": responseData.coord.lon,
        "description": responseData.weather[0].description,
        "temperature": Math.floor(responseData.main.temp),
        "feels_like": responseData.main.feels_like,
        "pressure": responseData.main.pressure,
        "maximum_temperature": Math.floor(responseData.main.temp_max),
        "minimum_temperature": Math.floor(responseData.main.temp_min),
        "humidity": responseData.main.humidity,
        "wind_speed": responseData.wind.speed,
        "wind_deg": responseData.wind.deg,
        "cloudiness": responseData.clouds.all,
        "sunrise": new Date(responseData.sys.sunrise * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        "sunset": new Date(responseData.sys.sunset * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        "name"  : responseData.name,
        "country" : responseData.sys.country
    };
}

async function getFootballNews() {
    let response, responseData = null;
    const options = {
        method: 'GET',
        url: 'https://football-news-aggregator-live.p.rapidapi.com/news/fourfourtwo/bundesliga',
        headers: {
            'X-RapidAPI-Key': FTBLNEW_KEY,
            'X-RapidAPI-Host': 'football-news-aggregator-live.p.rapidapi.com'
        }
    };
    try {
        response = await axios.request(options);
        responseData = response?.data;
    } catch (error) {
        console.error(error);
        return null;
    }

    return responseData;
}

async function getNewsByCity() {
    let response, responseData = null;

    try {
        response = await axios.get(`https://newsapi.org/v2/everything?q=weather&apiKey=${NEWSAPI_KEY}&pageSize=10&page=1`);
        responseData = response?.data?.articles;
    } catch {
        return null;
    }

    let answer = [];

    responseData.forEach(article => {
        answer.push({
            "source": article.source.name,
            "title": article.title,
            "description": article.description,
            "url": article.url,
            "image": article.urlToImage,
            "published_at": new Date(article.publishedAt).toLocaleString('en-GB', {
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric', hour12: false
            })
        });
    });

    return answer;
}
async function getTeamInfo(teamName) {
    const options = {
        method: 'GET',
        url: 'https://heisenbug-la-liga-live-scores-v1.p.rapidapi.com/api/laliga/team',
        params: { name: teamName },
        headers: {
            'X-RapidAPI-Key': YOUR_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'heisenbug-la-liga-live-scores-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Error fetching team info:', error);
        return null;
    }
}


const convertCurrency = async (have, want, amount) => {
    try {
        const response = await axios.get('https://api.api-ninjas.com/v1/convertcurrency', {
            params: {
                have: 'USD',
                want: "EUR",
                amount: 700
            },
            headers: {
                'X-Api-Key': NINJAAPI_KEY
            }
        });

        console.log('Conversion result:', response.data); // Выводим ответ в консоль
        return response.data; // Возвращаем результат преобразования
    } catch (error) {
        console.error('Request failed:', error);
        throw error; // Бросаем ошибку для обработки в случае неудачного запроса
    }
};


convertCurrency();

module.exports = {
    getWeatherByCity, convertCurrency, getTeamInfo, getFootballNews
};