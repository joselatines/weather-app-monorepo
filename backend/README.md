# Weather API with Authentication

A backend service providing weather data and user favorites management with JWT authentication.

## Features

- User registration and login
- JWT authentication
- Weather data from external API
- User-specific favorite cities
- Prisma ORM for database access
- Comprehensive test coverage

## Installation

### With Docker
```sh
docker-compose up
```

### Without Docker
1. Install dependencies:
```sh
npm install
```

2. Set up database:
```sh
npx prisma migrate dev
```

3. Start development server:
```sh
npm run dev
```

## API Endpoints

### Authentication

#### `POST /auth/register` - Register new user
**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "string (required, min 3 chars)",
  "password": "string (required, min 8 chars)"
}
```

**Success Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user_id": "string",
    "username": "string"
  }
}
```

#### `POST /auth/login` - Login user  
**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Success Response:**
```json
{
  "message": "Login successful",
  "data": {
    "token": "JWT string",
    "user": {
      "user_id": "string",
      "username": "string"
    }
  }
}
```

#### `GET /auth/me` - Get current user
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Success Response:**
```json
{
  "message": "Current user data fetched",
  "data": {
    "user_id": "string",
    "username": "string"
  }
}
```

### Weather

#### `GET /weather` - Get weather data
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Query Parameters:**
```
?city=string (required)
```

**Success Response:**
```json
{
  "message": "Weather data fetched successfully",
  "data": {
    "location": {
      "name": "string",
      "region": "string",
      "country": "string"
    },
    "current": {
      "temp_c": number,
      "condition": {
        "text": "string",
        "icon": "string"
      }
    }
  }
}
```

#### `GET /weather/autocomplete` - City autocomplete
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Query Parameters:**
```
?query=string (required)
```

**Success Response:**
```json
{
  "message": "City suggestions fetched successfully",
  "data": [
    {
      "id": number,
      "name": "string",
      "region": "string",
      "country": "string"
    }
  ]
}
```

### Favorites

#### `GET /favorites` - Get user favorites
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Success Response:**
```json
{
  "message": "Favorites fetched successfully",
  "data": ["string"]
}
```

#### `POST /favorites` - Add favorite city
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "city": "string (required)"
}
```

**Success Response:**
```json
{
  "message": "City added to favorites",
  "data": {
    "city_name": "string"
  }
}
```

#### `DELETE /favorites/{city}` - Remove favorite
**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Path Parameters:**
```
{city} = string (required)
```

**Success Response:**
```json
{
  "message": "City removed from favorites",
  "data": ["string"]
}
```

## Error Handling

Common error responses:
- 400 Bad Request - Invalid input
- 401 Unauthorized - Missing/invalid token
- 404 Not Found - Resource not found
- 409 Conflict - Duplicate username

## Development

```sh
npm run dev  # Start dev server
npm test     # Run tests
npm run lint # Run linter
```

## Testing

The test suite covers:
- Authentication flow
- Weather API endpoints
- Favorites management
- Error cases

Run tests:
```sh
npm test
```
