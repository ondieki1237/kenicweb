Kenic Domain API Backend

This project provides an API for checking .ke domains, querying WHOIS data, retrieving registrar pricing, and generating domain suggestions.

Table of Contents

Prerequisites

Environment Variables

Installation

Database Setup

Starting the Server

API Endpoints

Testing

Project Structure

Notes

Prerequisites

Node.js >= 18

npm or yarn

MongoDB (Atlas or local instance)

Optional: Postman or curl for API testing

Environment Variables

Create a .env file at the project root with the following:

# Main app database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/news_db?retryWrites=true&w=majority

# Kenic database
MONGODB_URI_KENIC=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kenic_db?retryWrites=true&w=majority

JWT_SECRET=your_jwt_secret

# Optional
PORT=5000


Replace <username> and <password> with your MongoDB Atlas credentials. MONGODB_URI_KENIC points to the Kenic-specific database for domain records.

Installation
# Clone the repository
git clone <repo-url>
cd kenic-backend

# Install dependencies
npm install

Database Setup

The project uses two MongoDB connections:

Main application DB: MONGODB_URI

Kenic domains DB: MONGODB_URI_KENIC

No initial collections required; Mongoose will create them automatically when the app runs.

Starting the Server
# Start in development with auto-reload
npm run dev

# Or build and run
npm run build
npm start


Server runs on http://localhost:5000 by default.

Base route: http://localhost:5000/ returns "API is running...".

API Endpoints

All endpoints are protected by JWT. Include: Authorization: Bearer <token>

Auth
http://localhost:5000/api/auth/register
http://localhost:5000/api/auth/login
POST /api/auth/login → Get JWT token

Domains

GET /api/domains/check/:domain → Check a single domain

GET /api/domains/whois/:domain → WHOIS lookup

POST /api/domains/bulk-check → Bulk check up to 10 domains

GET /api/domains/suggestions/:baseName → Generate domain suggestions

GET /api/domains/registrars → List all registrars

Example:
http://localhost:5000/api/domains/check/safaricom

curl -H "Authorization: Bearer <token>" http://localhost:5000/api/domains/check/example


Response:

{
  "success": true,
  "domain": "example.co.ke",
  "available": false,
  "message": "Domain is already registered",
  "whoisData": { ... },
  "pricing": [],
  "bestPrice": null
}

Testing

Login to get a bearer token token.
copy the token paste it into the authorization by picking bearer token
pick Get request then paste this http://localhost:5000/api/domains/check/safaricom for tesing

Use Postman, curl, or any REST client.

Include Authorization header in requests.

Test endpoints individually (single check, bulk check, suggestions).

Project Structure
kenic-backend/
│
├─ src/
│  ├─ config/
│  │  └─ db.ts
│  ├─ lib/
│  │  └─ mongokenic.ts
│  ├─ controllers/
│  │  └─ domainController.ts
│  ├─ models/
│  │  └─ Domain.ts
│  ├─ routes/
│  │  └─ domainRoutes.ts
│  ├─ services/
│  │  ├─ whoisKenic.ts
│  │  └─ registrars.ts
│  ├─ middleware/
│  │  └─ authMiddleware.ts
│  └─ server.ts
│
├─ package.json
├─ tsconfig.json
└─ .env


db.ts → Main MongoDB connection

mongokenic.ts → Kenic-specific MongoDB connection

services/ → WHOIS and registrar services

controllers/ → Route logic# mili-hack
