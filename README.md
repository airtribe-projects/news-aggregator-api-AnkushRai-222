# News Aggregator API

Simple Node.js/Express API that fetches news articles from an external news provider and serves them to authenticated users according to their preferences.

## Features
- Fetches latest English news articles (default pageSize: 20)
- Builds a search query from user preferences (joined with `OR`)
- Lightweight request logging (timestamp, IP, method, path, status, duration)
- Mongoose-based MongoDB connection (for user storage / auth)

## Prerequisites
- Node.js 14+

## Environment variables
I have not ignored the .env file for testing Purpose


## Installation
1. Clone the repo
   - git clone <repo-url>
2. Install dependencies
   - cd news-aggregator-api-AnkushRai-222
   - npm install
3. Add `.env` as above

## Run
- Start the server:
  - node app.js
- If package.json has scripts (e.g., `npm start` or `npm run dev`) you may use them:
  - npm start
  - npm run dev

On successful start the app connects to MongoDB and listens on the configured port.

## API Endpoints (overview)
Routes are mounted from `src/routes/*`. Check those files for exact path names/validation. Example common endpoints:

- POST /users/register
  - Description: Register a new user (if implemented)
  - Body (example): `{ "email": "user@example.com", "password": "secret", "preferences": ["tech","sports"] }`
  - Response: 201 Created / user object

- POST /users/login
  - Description: Authenticate and receive token (if implemented)
  - Body: `{ "email": "...", "password": "..." }`
  - Response: `{ "token": "..." }`

- GET /news
  - Description: Fetch news articles based on the authenticated user's preferences.
  - Authentication: If authentication is enforced, include Authorization header:
    - Authorization: Bearer <token>
  - Query / Behavior:
    - The server builds a query from the user's preferences (array). Preferences are trimmed and empty values removed. If there are preferences they are joined with ` OR ` (e.g. `tech OR sports`) and sent to the external News API as the `q` parameter. If no preferences, `q=news` is used.
    - Additional parameters sent: `language=en`, `pageSize=20`, `sortBy=publishedAt`, `apiKey=<NEWS_API_KEY>`
    - Request timeout to external API: 8000ms
  - Response: An array of article objects (or `[]` if none / failure to parse). On external API error, endpoint should return a 502-style error.

Example curl:
```
curl -H "Authorization: Bearer <token>" http://localhost:3000/news
```

## Logs
Incoming requests are logged to console with timestamp, client IP, HTTP method, path, response status and response time.

## Error handling
- If the service fails to fetch articles from the external provider, it throws a 502-style error with a cause message.
- If user is not provided (no auth), the controller throws a 401-style error.

