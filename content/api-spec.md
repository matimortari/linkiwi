# Linkstashr API Specification

This document provides documentation for the Linkstashr API.

## Overview

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.

---

## Endpoints

### Authentication

#### Sign In with OAuth Provider

**GET** `/auth/{provider}`

Initiates OAuth authentication flow. The supported providers are `google` and `github`.

**Response:**

- Redirects to the provider OAuth consent screen
- On success, redirects to application with session cookie

---

### User

#### Get User Profile

**GET** `/user`

Get the current user's profile information.

**Response:**

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "image": "string | null",
    "slug": "string",
    "description": "string | null",
    "createdAt": "Date",
    "updatedAt": "Date",
    "preferences": {
      "userId": "string",
      "backgroundType": "GRADIENT | FLAT",
      "backgroundColor": "string | null",
      "backgroundGradientStart": "string | null",
      "backgroundGradientEnd": "string | null",
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
      "supportBanner": "NONE | string"
    },
    "views": [
      {
        "id": "string",
        "userId": "string",
        "date": "Date"
      }
    ]
  }
}
```

#### Get User by Slug

**GET** `/user/{slug}`

Retrieves a user's public profile information by slug.

**Route Parameters:**

- `slug`: User slug.

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string | null",
  "image": "string | null",
  "links": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "clicks": "number",
      "createdAt": "Date"
    }
  ],
  "icons": [
    {
      "id": "string",
      "url": "string",
      "platform": "string",
      "logo": "string",
      "clicks": "number",
      "createdAt": "Date"
    }
  ],
  "preferences": {
    // Same as user preferences above
  }
}
```

#### Update User Profile

**PUT** `/user`

Update current user's profile information.

**Request Body:**

```json
{
  "name": "string | optional",
  "image": "string | optional",
  "description": "string | optional",
  "slug": "string | optional"
}
```

**Response:**

```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "slug": "string",
  "description": "string | null",
  "image": "string | null",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Update User Preferences

**PUT** `/user/preferences`

Updates the authenticated user's preferences.

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

#### Update User Image

**PUT** `/user/image-upload`

Update current user's profile image.

**Request Body**:

```json
{
  "file": "binary image file (PNG, JPG, or WebP, max 2MB)" // multipart/form-data
}
```

**Response**:

```json
{
  "imageUrl": "string"
}
```

#### Delete User Account

**DELETE** `/user`

Delete current user account.

**Response**:

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

### Links

#### Get User Links

**GET** `/links`

Get all links for the current user.

**Response:**

```json
{
  "links": [
    {
      "id": "string",
      "url": "string",
      "title": "string",
      "clicks": "number",
      "createdAt": "Date"
    }
  ]
}
```

#### Create New Link

**POST** `/links`

Create a new link.

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
    "id": "string",
    "url": "string",
    "title": "string",
    "clicks": 0,
    "createdAt": "Date"
  }
}
```

#### Update Link by ID

**PUT** `/links/{id}`

Update an existing link.

**Route Parameters:**

- `id`: Link ID.

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
    "id": "string",
    "url": "string",
    "title": "string",
    "clicks": "number",
    "createdAt": "Date"
  }
}
```

#### Delete Link by ID

**DELETE** `/links/{id}`

Delete a link.

**Route Parameters:**

- `id`: Link ID.

**Response:**

```json
{
  "message": "Link deleted successfully"
}
```

---

### Social Icons

#### Get User Social Icons

**GET** `/icons`

Get all social icons for the current user.

**Response:**

```json
{
  "icons": [
    {
      "id": "string",
      "url": "string",
      "platform": "string",
      "logo": "string",
      "clicks": "number",
      "createdAt": "Date"
    }
  ]
}
```

#### Create New Social Icon

**POST** `/icons`

Create a new social icon.

**Request Body:**

```json
{
  "url": "string (valid URL, required)",
  "platform": "string (see supported platforms below, required)",
  "logo": "string (corresponding icon value, required)"
}
```

**Supported Platforms:**

- Airbnb, Amazon, App Store, Apple Music, Apple Podcasts, Bandcamp, Behance, Bluesky, CodePen, Discord, Dribbble, Etsy, Facebook, GitHub, Gmail, Goodreads, Google Maps, Google Play, Instagram, Kickstarter, LinkedIn, Mastodon, Medium, Notion, Patreon, Pinterest, Reddit, ResearchGate, Shopify, Signal, Slack, Snapchat, SoundCloud, Spotify, Stack Overflow, Telegram, TikTok, Tripadvisor, Trello, Twitch, Vimeo, Whatsapp, X, Yelp, Youtube

**Response:**

```json
{
  "icon": {
    "id": "string",
    "url": "string",
    "platform": "string",
    "logo": "string",
    "clicks": 0,
    "createdAt": "Date"
  }
}
```

#### Delete Social Icon by ID

**DELETE** `/icons/{id}`

Delete a social icon.

**Route Parameters:**

- `id`: Social icon ID.

**Response:**

```json
{
  "message": "Social icon deleted successfully"
}
```

---

### Analytics

#### Record Analytics Event

**POST** `/analytics`

Record analytics data for page views, link clicks, or social icon clicks.

**Request Body:**

```json
{
  "type": "pageView | link | icon",
  "userId": "string (required)",
  "id": "string (required for link and icon types, optional for pageView)"
}
```

**Response:**

```json
{
  "message": "Analytics recorded successfully"
}
```

#### Delete All User Analytics

**DELETE** `/analytics`

Delete all analytics data for the current user.

**Response:**

```json
{
  "message": "Analytics deleted successfully"
}
```

---
