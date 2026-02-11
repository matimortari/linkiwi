# AllLinks API Specification

This document provides comprehensive documentation for the AllLinks REST API, which is used by the AllLinks web application to manage user profiles, links, social icons, and analytics. The AllLinks API is organized around REST principles with predictable resource-oriented URLs, JSON request/response bodies, and standard HTTP response codes.

## Overview

### Authentication

The API uses OAuth 2.0 for user authentication via third-party providers (Google and GitHub). Sessions are managed using secure HTTP-only cookies.

### Response Format

All responses are returned in JSON format. Successful responses return a `2xx` status code. Error responses include an error message in the response body.

### Error Handling

The API uses standard HTTP response codes to indicate success or failure:

- `200 OK` - Request succeeded
- `400 Bad Request` - Invalid request parameters or validation error
- `401 Unauthorized` - Authentication required or invalid credentials
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `500 Internal Server Error` - Server error

---

## Endpoints

### Authentication & Session

#### Login with Provider

> **POST** `/api/auth/{provider}`

Initiates OAuth login with the specified provider.

**Route Parameters:**

- `provider`: OAuth provider name (required). Supported providers: `google`, `github`.

**Response:**

Navigates to the provider's OAuth consent screen.

#### Logout

> **POST** `/api/auth/logout`

Logs out the authenticated user and clears the session.

**Response:**

```json
{
  "success": true
}
```

#### Refresh Session

> **POST** `/api/auth/refresh`

Refreshes the authenticated user's session, extending it by 7 days.

**Response:**

```json
{
  "success": true,
  "expiresAt": "Date"
}
```

#### Validate Session

> **POST** `/api/auth/validate`

Validates the authenticated user's session and checks for inactivity timeout. Updates the last activity timestamp.

**Response:**

```json
{
  "valid": true,
  "expiresAt": "Date"
}
```

---

### User Profile

#### Get User Profile

> **GET** `/api/user`

Retrieves the authenticated user's profile information, including preferences, comments, and page views.

**Response:**

```json
{
  "userData": {
    "id": "string",
    "email": "string",
    "name": "string",
    "image": "string | null",
    "slug": "string",
    "description": "string | null",
    "createdAt": "string",
    "updatedAt": "string",
    "preferences": {
      "userId": "string",
      "backgroundType": "FLAT | GRADIENT",
      "backgroundColor": "string",
      "backgroundGradientStart": "string",
      "backgroundGradientEnd": "string",
      "profilePictureRadius": "string",
      "profilePictureBorderColor": "string",
      "profilePictureBorderWidth": "string",
      "slugTextColor": "string",
      "slugTextWeight": "string",
      "slugTextSize": "string",
      "slugFontFamily": "string",
      "headerTextColor": "string",
      "headerTextWeight": "string",
      "headerTextSize": "string",
      "headerFontFamily": "string",
      "linkBackgroundColor": "string",
      "linkTextColor": "string",
      "linkTextWeight": "string",
      "linkTextSize": "string",
      "linkFontFamily": "string",
      "isLinkShadow": "boolean",
      "linkShadowColor": "string",
      "linkShadowWeight": "string",
      "linkHoverBackgroundColor": "string",
      "linkBorderRadius": "string",
      "linkPadding": "string",
      "showLinkCopyButton": "boolean",
      "iconBackgroundColor": "string",
      "isIconShadow": "boolean",
      "iconShadowColor": "string",
      "iconShadowWeight": "string",
      "iconLogoColor": "string",
      "iconHoverBackgroundColor": "string",
      "supportBanner": "NONE | LGBTQ_RIGHTS | ANTI_RACISM | MENTAL_HEALTH | CLIMATE_ACTION",
      "enableGuestbook": "boolean"
    },
    "comments": [
      {
        "id": "string",
        "userId": "string",
        "name": "string",
        "email": "string | null",
        "message": "string",
        "createdAt": "string"
      }
    ],
    "views": [
      {
        "id": "string",
        "userId": "string",
        "createdAt": "string",
        "referrer": "string | null",
        "source": "string | null"
      }
    ]
  }
}
```

#### Get User Public Profile

> **GET** `/api/user/{slug}`

Retrieves a public user information by slug, including their links, social icons, and preferences.

**Route Parameters:**

- `slug`: User slug (required).

**Response:**

```json
{
  "userProfile": {
    "id": "string",
    "email": "string",
    "name": "string",
    "image": "string | null",
    "slug": "string",
    "description": "string | null",
    "createdAt": "string",
    "updatedAt": "string",
    "links": [
      {
        // ... Link details
      }
    ],
    "icons": [
      {
        // ... Icon details
      }
    ],
    "preferences": {
      // ... Preferences details
    }
  }
}
```

#### Update User Profile

> **PUT** `/api/user`

Updates the authenticated user's profile information.

**Request Body:** All fields are optional

```json
{
  "name": "string", // Optional: 3-50 characters
  "image": "string | null", // Optional: valid URL or null to remove image
  "description": "string", // Optional: up to 300 characters
  "slug": "string" // Optional: 3-50 characters, lowercase alphanumeric and hyphens only
}
```

**Response:**

```json
{
  "updatedUser": {
    "id": "string",
    "email": "string",
    "name": "string",
    "slug": "string",
    "description": "string | null",
    "image": "string | null",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Update User Image

> **PUT** `/api/user/image-upload`

Uploads and updates the authenticated user's profile image. Replaces the existing image if one exists.

**Request Body:** Multipart form data

- `file`: Image file (PNG, JPEG, or WebP format, max 2MB)

**Response:**

```json
{
  "imageUrl": "string"
}
```

#### Update User Preferences

> **PUT** `/api/user/preferences`

Updates the authenticated user's profile preferences.

**Request Body:** All fields are optional

```json
{
  // ... All preference fields
}
```

**Response:**

```json
{
  "updatedPreferences": {
    // ... Preferences details
  }
}
```

#### Delete User Account

> **DELETE** `/api/user`

Deletes the authenticated user's account and all associated data. This action cannot be undone.

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Links

#### Get User Links

> **GET** `/api/links`

Retrieves all links for the authenticated user.

**Response:**

```json
{
  "links": [
    {
      "id": "string",
      "userId": "string",
      "url": "string",
      "title": "string",
      "clickCount": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### Create Link

> **POST** `/api/links`

Creates a new link for the authenticated user.

**Request Body:**

```json
{
  "url": "string", // Required: valid URL starting with http:// or https://
  "title": "string" // Required: 1-100 characters
}
```

**Response:**

```json
{
  "link": {
    // ... Link details
  }
}
```

#### Update Link

> **PUT** `/api/links/{link}`

Updates an existing link for the authenticated user.

**Route Parameters:**

- `link`: Link ID (required).

**Request Body:** All fields are optional

```json
{
  "url": "string", // Optional: valid URL starting with http:// or https://
  "title": "string" // Optional: 1-100 characters
}
```

**Response:**

```json
{
  "link": {
    // ... Link details
  }
}
```

#### Delete Link

> **DELETE** `/api/links/{link}`

Deletes a link for the authenticated user.

**Route Parameters:**

- `link`: Link ID (required).

**Response:**

```json
{
  "success": true,
  "message": "Link deleted successfully"
}
```

---

### Social Icons

#### Get User Social Icons

> **GET** `/api/social-icons`

Retrieves all social icons for the authenticated user.

**Response:**

```json
{
  "icons": [
    {
      "id": "string",
      "userId": "string",
      "url": "string",
      "platform": "string",
      "logo": "string",
      "clickCount": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### Create Social Icon

> **POST** `/api/social-icons`

Creates a new social icon for the authenticated user. Only one icon per platform is allowed.

**Request Body:**

```json
{
  "url": "string", // Required: valid URL starting with http:// or https://
  "platform": "string", // Required: must be one of the supported platforms
  "logo": "string" // Required: must match the platform's corresponding logo value
}
```

**Supported Platforms:**

- Airbnb, Amazon, App Store, Apple Music, Apple Podcasts, Bandcamp, Behance, Bluesky, Calendly, CodePen, Discord, Dribbble, Etsy, Facebook, GitHub, Gmail, Goodreads, Google Maps, Google Play, Instagram, Kickstarter, Letterboxd, LinkedIn, Mastodon, Medium, Notion, Patreon, Pinterest, Reddit, ResearchGate, Shopify, Signal, Slack, Snapchat, SoundCloud, Spotify, Stack Overflow, Substack, Telegram, TikTok, Tripadvisor, Trello, Twitch, Vimeo, Whatsapp, X, Yelp, Youtube

**Response:**

```json
{
  "icon": {
    // ... Icon details
  }
}
```

#### Delete Social Icon

> **DELETE** `/api/social-icons/{icon}`

Deletes a social icon for the authenticated user.

**Route Parameters:**

- `icon`: Social icon ID (required).

**Response:**

```json
{
  "success": true,
  "message": "Icon deleted successfully"
}
```

---

### Analytics

#### Get Analytics Data

> **GET** `/api/analytics`

Retrieves all analytics data for the authenticated user, including page views, link clicks, and social icon clicks.

**Response:**

```json
{
  "pageViews": [
    {
      "id": "string",
      "userId": "string",
      "createdAt": "string",
      "referrer": "string | null",
      "source": "string | null"
    }
  ],
  "linkClicks": [
    {
      "userLinkId": "string",
      "createdAt": "string",
      "userLink": {
        // ... Link details
      }
    }
  ],
  "iconClicks": [
    {
      "userIconId": "string",
      "createdAt": "string",
      "userIcon": {
        // ... Icon details
      }
    }
  ]
}
```

#### Get Referrer Statistics

> **GET** `/api/analytics/referrers`

Retrieves referrer statistics for the authenticated user's page views, showing traffic sources and percentages.

**Query Parameters:** All parameters are optional

- `dateFrom`: Start date for filtering (ISO 8601 format).
- `dateTo`: End date for filtering (ISO 8601 format).

**Response:**

```json
{
  "referrers": [
    {
      "source": "string",
      "count": "number",
      "percentage": "string",
      "label": "string"
    }
  ],
  "totalViews": "number"
}
```

#### Record Analytics Event

> **POST** `/api/analytics`

Records analytics data for page views, link clicks, or social icon clicks. Does not record analytics for the user's own profile interactions.

**Request Body:**

```json
{
  "type": "pageView | link | icon", // Required: analytics event type
  "userId": "string", // Required: user ID
  "id": "string", // Required for link and icon types, optional for pageView
  "referrer": "string" // Optional: only for pageView type
}
```

**Response (Page View):**

```json
{
  "message": "Page view recorded"
}
```

**Response (Link Click):**

```json
{
  "message": "Link click recorded",
  "linkClick": {
    "userLinkId": "string",
    "createdAt": "string"
  }
}
```

**Response (Icon Click):**

```json
{
  "message": "Social icon click recorded",
  "iconClick": {
    "userIconId": "string",
    "createdAt": "string"
  }
}
```

**Note:** Analytics events are not recorded when users interact with their own profile.

#### Create Guestbook Comment

> **POST** `/api/analytics/comments`

Creates a new comment in the user's guestbook. The user must have guestbook enabled in their preferences.

**Request Body:**

```json
{
  "userId": "string", // Required: user ID to post comment to
  "name": "string", // Required: 1-100 characters
  "email": "string", // Optional: valid email address
  "message": "string" // Required: 1-500 characters
}
```

**Response:**

```json
{
  "comment": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "email": "string | null",
    "message": "string",
    "createdAt": "string"
  }
}
```

#### Delete Analytics Data

> **DELETE** `/api/analytics`

Deletes analytics data for the authenticated user. Can be filtered by type and date range.

**Query Parameters:** All parameters are optional

- `type`: Analytics type to delete (`pageView`, `linkClick`, or `iconClick`). If omitted, all types are deleted.
- `dateFrom`: Start date for filtering (ISO 8601 format).
- `dateTo`: End date for filtering (ISO 8601 format).

**Response:**

```json
{
  "success": true,
  "message": "Successfully deleted {count} analytics record(s)"
}
```

**Note:** The message will display the actual count of deleted records (e.g., "Successfully deleted 5 analytics records" or "Successfully deleted 1 analytics record").

---
