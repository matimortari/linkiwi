# LinkNest API Specification

This document provides documentation for the LinkNest API.

## Authentication

Most endpoints require authentication via session cookies. Authentication is handled through OAuth providers.

#### GET `/api/auth/google`

Initiates Google OAuth authentication flow.

**Response:**

- Redirects to Google OAuth consent screen
- On success, redirects to application with session cookie

#### GET `/api/auth/github`

Initiates GitHub OAuth authentication flow.

**Response:**

- Redirects to GitHub OAuth consent screen
- On success, redirects to application with session cookie

---

## Response Format

All responses follow a consistent JSON format:

### Success Response

```json
{
  "data": "response_data"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error message"
}
```

---

## Error Codes

- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict
- **500 Internal Server Error**: Server error

---

## Endpoints

### User Endpoints

#### GET `/user`

Retrieves the authenticated user's profile information.

**Authentication:** Required

**Response:**

```json
{
  "user": {
    "id": "cuid",
    "name": "string",
    "email": "string",
    "slug": "string",
    "description": "string | null",
    "preferences": {
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
      "supportBanner": "NONE | LGBTQ_RIGHTS | ANTI_RACISM | MENTAL_HEALTH | CLIMATE_ACTION"
    }
  }
}
```

#### PUT `/user`

Updates the authenticated user's profile information.

**Authentication:** Required

**Request Body:**

```json
{
  "name": "string (2-100 chars, optional)",
  "email": "string (valid email, optional)",
  "slug": "string (alphanumeric with hyphens only, optional)",
  "description": "string (max 300 chars, optional)",
  "image": "string (valid URL, optional)"
}
```

**Response:**

```json
{
  "user": {
    "id": "cuid",
    "name": "string",
    "email": "string",
    "slug": "string",
    "description": "string | null",
    "image": "string | null"
  }
}
```

#### DELETE `/user`

Permanently deletes the authenticated user's account and all associated data.

**Authentication:** Required

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

#### GET `/user/{slug}`

Retrieves a user's public profile by slug, including links, icons, and preferences.

**Parameters:**

- `slug` (path): User's unique slug

**Response:**

```json
{
  "id": "cuid",
  "name": "string",
  "slug": "string",
  "description": "string | null",
  "image": "string | null",
  "links": [
    {
      "id": "cuid",
      "url": "string",
      "title": "string",
      "clicks": "number",
      "createdAt": "datetime"
    }
  ],
  "icons": [
    {
      "id": "cuid",
      "url": "string",
      "platform": "string",
      "logo": "string",
      "clicks": "number",
      "createdAt": "datetime"
    }
  ],
  "preferences": {
    // Same as user preferences above
  }
}
```

#### PUT `/user/preferences`

Updates the authenticated user's appearance preferences.

**Authentication:** Required

**Request Body:** All fields are optional

```json
{
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
  "supportBanner": "NONE | LGBTQ_RIGHTS | ANTI_RACISM | MENTAL_HEALTH | CLIMATE_ACTION"
}
```

**Response:**

```json
{
  "preferences": {
    // Updated preferences object
  }
}
```

---

### Links Endpoints

#### GET `/links`

Retrieves all links for the authenticated user.

**Authentication:** Required

**Response:**

```json
{
  "links": [
    {
      "id": "cuid",
      "url": "string",
      "title": "string",
      "clicks": "number",
      "createdAt": "datetime"
    }
  ]
}
```

#### POST `/links`

Creates a new link for the authenticated user.

**Authentication:** Required

**Request Body:**

```json
{
  "url": "string (valid URL, required)",
  "title": "string (1-100 chars, required)"
}
```

**Response:**

```json
{
  "link": {
    "id": "cuid",
    "url": "string",
    "title": "string",
    "clicks": 0,
    "createdAt": "datetime"
  }
}
```

#### PUT `/links/{id}`

Updates an existing link for the authenticated user.

**Authentication:** Required

**Parameters:**

- `id` (path): Link ID

**Request Body:**

```json
{
  "url": "string (valid URL, optional)",
  "title": "string (1-100 chars, optional)"
}
```

**Response:**

```json
{
  "link": {
    "id": "cuid",
    "url": "string",
    "title": "string",
    "clicks": "number",
    "createdAt": "datetime"
  }
}
```

#### DELETE `/links/{id}`

Deletes a link for the authenticated user.

**Authentication:** Required

**Parameters:**

- `id` (path): Link ID

**Response:**

```json
{
  "message": "Link deleted successfully"
}
```

---

### Icons Endpoints

#### GET `/icons`

Retrieves all social media icons for the authenticated user.

**Authentication:** Required

**Response:**

```json
{
  "icons": [
    {
      "id": "cuid",
      "url": "string",
      "platform": "string",
      "logo": "string",
      "clicks": "number",
      "createdAt": "datetime"
    }
  ]
}
```

#### POST `/icons`

Creates a new social media icon for the authenticated user.

**Authentication:** Required

**Request Body:**

```json
{
  "url": "string (valid URL, required)",
  "platform": "string (see supported platforms below, required)",
  "logo": "string (corresponding icon value, required)"
}
```

**Supported Platforms:**

- Airbnb, Amazon, App Store, Apple Music, Apple Podcasts, Bandcamp, Behance, Bluesky, CodePen, Discord, Dribbble, Etsy, Facebook, GitHub, Gmail, Goodreads, Google Maps, Google Play, Instagram, Kickstarter, LinkedIn, Mastodon, Medium, Notion, Patreon, Pinterest, Reddit, ResearchGate, Shopify, Signal, Slack, Snapchat, SoundCloud, Spotify, Stack Overflow, Telegram, Tiktok, Tripadvisor, Trello, Twitch, Vimeo, Whatsapp, X, Yelp, Youtube

**Response:**

```json
{
  "icon": {
    "id": "cuid",
    "url": "string",
    "platform": "string",
    "logo": "string",
    "clicks": 0,
    "createdAt": "datetime"
  }
}
```

#### DELETE `/icons/{id}`

Deletes a social media icon for the authenticated user.

**Authentication:** Required

**Parameters:**

- `id` (path): Icon ID

**Response:**

```json
{
  "message": "Icon deleted successfully"
}
```

---

### Analytics Endpoints

#### POST `/analytics`

Records analytics data for page views, link clicks, or icon clicks.

**Request Body:**

```json
{
  "type": "pageView | link | icon",
  "userId": "cuid (required)",
  "id": "cuid (required for link and icon types, optional for pageView)"
}
```

**Response:**

```json
{
  "message": "Analytics recorded successfully"
}
```

#### DELETE `/analytics`

Deletes all analytics data for the authenticated user.

**Authentication:** Required

**Response:**

```json
{
  "message": "Analytics deleted successfully"
}
```

---
