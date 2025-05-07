# Weather App with Database

This is a weather application with both frontend and backend in a single project. It features:

- React frontend for displaying weather information
- Express backend for storing favorite locations in a SQLite database
- Database file (`favorites.db`) that persists your favorite locations
- API endpoints for testing with Postman

## Quick Start

1. Install all dependencies, including sqlite3:

```bash
npm install
npm install sqlite3
```

2. Start both frontend and backend:

```bash
npm start
```

This will start:

- React frontend on http://localhost:3000
- Express backend on http://localhost:5000
- Create the SQLite database file (`favorites.db`) if it doesn't exist already

## Features

- Search for weather by location
- View 7-day forecast with detailed daily information
- Save favorite locations (stored in SQLite database)
- Search suggestions with favorite indicators
- Responsive design for all devices

## Database File

Your favorite locations are stored in a SQLite database file called `favorites.db` in the backend directory. This file is:

- Created automatically when you start the backend server
- Updated when you add or remove favorites
- Persists between app restarts
- Accessible via API endpoints

## API Endpoints for Postman

You can test the following API endpoints using Postman:

### GET /api/favorites

- Returns all favorite locations
- Example: `http://localhost:5000/api/favorites`

### POST /api/favorites

- Adds a new location to favorites
- Example: `http://localhost:5000/api/favorites`
- Request body: `{ "location": "London" }`

### DELETE /api/favorites/:location

- Removes a location from favorites
- Example: `http://localhost:5000/api/favorites/London`

## Postman Collection

Import the provided `weather-app-api.postman_collection.json` file into Postman to quickly test all API endpoints.

## Project Structure

```
weather-app/
├── src/                # React frontend code
├── public/             # Public assets
├── backend/            # Express backend server and database
│   ├── server.js       # Backend server code
│   └── favorites.db    # SQLite database file for favorites
├── package.json        # Combined dependencies and scripts
└── README.md           # Project documentation
```

## Technologies Used

- **Frontend**: React, Axios, CSS
- **Backend**: Node.js, Express, SQLite
- **Database**: SQLite (`favorites.db`)
- **API Testing**: Postman

## Weather API

The app uses WeatherAPI.com for weather data. The API key is included for demonstration purposes.

## Troubleshooting

- If you see a "Proxy error" message, ensure the backend server is running on port 5000.
- If favorites aren't being saved, check that the app has write permissions in the backend directory.
- If you get an error about missing the `sqlite3` module, run:
  ```bash
  npm install sqlite3
  ```
- If you need to reset your favorites, delete the `favorites.db` file in the backend directory and restart the backend server.
