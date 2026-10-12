# Weather Dashboard App

A simple weather dashboard web app that displays live weather data and handles real-world network conditions.

## Default City
- Defaults to Mansourieh (El Matn, Lebanon) upon opening.

## Features
- Search weather by city name.
- Displays current temperature, conditions, weather icon, feels-like temperature, humidity, and wind speed.
- Includes a 3-day forecast.
- Built using `async/await` and explicit `try/catch` error handling with non-200 HTTP response detection.
- Visible loading indicator while fetching data.

## Setup & API Key Instructions
To run this application and keep your credentials secure:
1. Go to [OpenWeatherMap](https://openweathermap.org/) and create a free account.
2. Navigate to your profile menu and select "My API Keys" to generate a new key.
3. Create a file named `.env` in the root folder of your project.
4. Add your generated API key inside the `.env` file:
   ```env
   API_KEY=your_actual_api_key_here
## How to Run
Double-click `index.html` to open it in any browser.
## Notes:
I chose to screenshot the result of Riyadh, Saudi Arabia's weather for this assignment demonstration.