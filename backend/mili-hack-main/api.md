# API Documentation

This document describes all available API endpoints in the backend and their purposes.

---

## Authentication APIs (`/api/auth`)

### POST `/register`
- **Purpose:** Register a new user account.
- **Request Body:** User registration details (e.g., email, password, etc.)
- **Response:** Success or error message.

### POST `/login`
- **Purpose:** Log in an existing user and receive an authentication token.
- **Request Body:** User credentials (email, password).
- **Response:** Auth token and user info on success, error on failure.

---

## Domain APIs (`/api/domains`)

### GET `/check/:domain`
- **Purpose:** Check the availability of a single domain name.
- **Auth:** Required
- **Params:** `domain` (string) — The domain name to check.
- **Response:** Availability status and details.

### GET `/whois/:domain`
- **Purpose:** Get detailed WHOIS information for a domain.
- **Auth:** Required
- **Params:** `domain` (string) — The domain name to look up.
- **Response:** WHOIS data.

### POST `/bulk-check`
- **Purpose:** Check the availability of up to 10 domains at once.
- **Auth:** Required
- **Request Body:** List of domain names.
- **Response:** Availability status for each domain.

### GET `/suggestions/:baseName`
- **Purpose:** Generate domain name suggestions based on a base name, including pricing.
- **Auth:** Required
- **Params:** `baseName` (string) — The base name for suggestions.
- **Response:** List of suggested domains and prices.

### GET `/registrars`
- **Purpose:** List all accredited domain registrars.
- **Auth:** Required
- **Response:** List of registrars.

---

**Note:** All `/domains` endpoints require authentication (token in headers), except for `/auth` endpoints.
