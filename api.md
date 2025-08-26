# API Documentation

This document lists all API endpoints in the project and their roles.

---

## Authentication APIs

### POST `/api/auth/register`
- **Role:** Register a new user.
- **Access:** Public

### POST `/api/auth/login`
- **Role:** Authenticate a user and return a JWT token.
- **Access:** Public

---

## Domain APIs

> All domain APIs require authentication (protected routes).

### GET `/api/domains/check/:domain`
- **Role:** Check availability of a single domain.
- **Access:** Protected

### GET `/api/domains/whois/:domain`
- **Role:** Get detailed WHOIS information for a domain.
- **Access:** Protected

### POST `/api/domains/bulk-check`
- **Role:** Check availability for up to 10 domains at once.
- **Access:** Protected

### GET `/api/domains/suggestions/:baseName`
- **Role:** Generate domain name suggestions.
- **Access:** Protected

### GET `/api/domains/registrars`
- **Role:** List all registrars.
- **Access:** Protected

### GET `/api/domains/ai-suggestions`
- **Role:** Get AI-powered domain name suggestions.
- **Access:** Protected

---

**Note:**  
- All protected routes require a valid authentication token in the `Authorization: Bearer <token>` header.
- Base route: `GET /` returns "API is running".
