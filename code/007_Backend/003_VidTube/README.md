# VidTube API

VidTube is a REST API for a video-sharing application. It provides account and session management, video uploads, comments, likes, playlists, tweets, subscriptions, and channel dashboard data. The backend is built with Node.js, Express, MongoDB, and Cloudinary.

## Features

- User registration, login, logout, token refresh, and password changes
- JWT-protected endpoints for user-specific actions
- Video publishing, browsing, metadata updates, and deletion
- Image and video asset storage through Cloudinary
- Comments, likes, playlists, tweets, and channel subscriptions
- Watch history and channel statistics
- Paginated video, comment, and dashboard video results

## Requirements

- Node.js 20 or later
- MongoDB connection URI
- Cloudinary account for media uploads

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.sample` to `.env` and fill in the values for your environment. Keep `.env` private and do not commit credentials.

3. Start the development server:

   ```bash
   npm run dev
   ```

   For a regular start without the development watcher:

   ```bash
   npm start
   ```

The API listens on port `8001` by default. Set `PORT` to use another port. MongoDB connects to the `VidTube` database using `MONGODB_URI` as the base URI.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime environment; set to `production` when deployed |
| `PORT` | HTTP port; defaults to `8001` |
| `MONGODB_URI` | MongoDB connection URI without the database name |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access-token lifetime accepted by `jsonwebtoken` |
| `REFRESH_TOKEN_SECRET` | Separate secret used to sign refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh-token lifetime accepted by `jsonwebtoken` |
| `CORS_ORIGIN` | Frontend origin allowed by the credentialed CORS configuration |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Use long, unique, randomly generated token secrets. Do not reuse the sample placeholder values.

## Authentication

Login returns an access token in the response body and sets HTTP-only `accessToken` and `refreshToken` cookies. Protected routes accept the access token from either the `accessToken` cookie or an `Authorization: Bearer <access-token>` header. Use `POST /api/v1/users/refresh-token` to refresh a session and `POST /api/v1/users/logout` to log out.

In production, the auth cookies are marked `Secure` and use `SameSite=None` to support cross-site frontends. Configure the frontend origin and deployment security settings accordingly.

## API reference

All endpoints use the `/api/v1` prefix. Routes marked **Yes** require an access token.

| Feature | Method | Path | Auth | Description |
| --- | --- | --- | --- | --- |
| Health | `GET` | `/healthcheck/` | No | Basic health response |
| Users | `POST` | `/users/register` | No | Register with `fullName`, `email`, `username`, `password`, and required `avatar`; optional `coverImage` |
| Users | `POST` | `/users/login` | No | Log in with `email` or `username` and `password` |
| Users | `POST` | `/users/refresh-token` | No | Refresh the access token using the refresh cookie or request body |
| Users | `POST` | `/users/logout` | Yes | Invalidate the refresh token and clear auth cookies |
| Users | `POST` | `/users/change-password` | Yes | Change password using `oldPassword` and `newPassword` |
| Users | `GET` | `/users/current-user` | Yes | Get the signed-in user |
| Users | `GET` | `/users/c/:username` | Yes | Get a channel profile and subscription counts |
| Users | `PATCH` | `/users/update-account` | Yes | Update `fullName` and `email` |
| Users | `PATCH` | `/users/avatar` | Yes | Replace the avatar; multipart field `avatar` |
| Users | `PATCH` | `/users/cover-image` | Yes | Replace the cover image; multipart field `coverImage` |
| Users | `GET` | `/users/history` | Yes | Get the signed-in user's watch history |
| Videos | `GET` | `/videos` | No | Browse published videos; supports `page`, `limit`, `query`, `sortBy`, and `sortType` |
| Videos | `GET` | `/videos/user/:userId` | No | Browse a user's published videos |
| Videos | `POST` | `/videos` | Yes | Publish a video; multipart fields `videoFile` and `thumbnail`, plus `title` and `description` |
| Videos | `GET` | `/videos/:videoId` | Yes | Get a published video or an owned unpublished video; increments views and watch history |
| Videos | `PATCH` | `/videos/:videoId` | Yes | Update an owned video's `title`, `description`, and/or `thumbnail` |
| Videos | `DELETE` | `/videos/:videoId` | Yes | Delete an owned video and its related records |
| Videos | `PATCH` | `/videos/:videoId/publish` | Yes | Toggle an owned video's published state |
| Comments | `GET` | `/comments/:videoId` | Yes | Get paginated comments for a video |
| Comments | `POST` | `/comments/:videoId` | Yes | Add a comment with `content` |
| Comments | `PATCH` | `/comments/c/:commentId` | Yes | Update an owned comment |
| Comments | `DELETE` | `/comments/c/:commentId` | Yes | Delete an owned comment |
| Tweets | `GET` | `/tweets/user/:userId` | Yes | List a user's tweets |
| Tweets | `POST` | `/tweets` | Yes | Create a tweet with `content` |
| Tweets | `PATCH` | `/tweets/:tweetId` | Yes | Update an owned tweet |
| Tweets | `DELETE` | `/tweets/:tweetId` | Yes | Delete an owned tweet |
| Subscriptions | `GET` | `/subscriptions/c/:channelId` | Yes | List a channel's subscribers |
| Subscriptions | `POST` | `/subscriptions/c/:channelId` | Yes | Toggle subscription to a channel |
| Subscriptions | `GET` | `/subscriptions/u/:subscriberId` | Yes | List channels a user subscribes to |
| Playlists | `POST` | `/playlists` | Yes | Create a playlist with `name` and `description` |
| Playlists | `GET` | `/playlists/user/:userId` | Yes | List the signed-in user's playlists |
| Playlists | `GET` | `/playlists/:playlistId` | Yes | Get an owned playlist |
| Playlists | `PATCH` | `/playlists/:playlistId` | Yes | Update playlist `name` and/or `description` |
| Playlists | `DELETE` | `/playlists/:playlistId` | Yes | Delete an owned playlist |
| Playlists | `PATCH` | `/playlists/:playlistId/video/:videoId` | Yes | Add a video to an owned playlist |
| Playlists | `DELETE` | `/playlists/:playlistId/video/:videoId` | Yes | Remove a video from an owned playlist |
| Likes | `GET` | `/likes/videos` | Yes | List the signed-in user's liked, published videos |
| Likes | `POST` | `/likes/toggle/v/:videoId` | Yes | Toggle a video like |
| Likes | `POST` | `/likes/toggle/c/:commentId` | Yes | Toggle a comment like |
| Likes | `POST` | `/likes/toggle/t/:tweetId` | Yes | Toggle a tweet like |
| Dashboard | `GET` | `/dashboard/stats` | Yes | Get channel video, view, subscriber, and like totals |
| Dashboard | `GET` | `/dashboard/videos` | Yes | List the signed-in channel's videos; supports `page` and `limit` |

## Request and response notes

- Send JSON for standard request bodies. Upload routes use `multipart/form-data`.
- Successful responses use a JSON envelope with `statusCode`, `data`, `message`, and `success` fields.
- Errors are returned through a shared error handler. Development responses may include a stack trace.
- Video and comment listing endpoints return pagination metadata with their results.
- Uploaded files are staged in the operating system's temporary directory, then sent to Cloudinary.

## Testing

The repository does not currently define an automated test suite; `npm test` is a placeholder. API routes have been manually exercised during development. Add and run automated tests before relying on them in continuous integration or release workflows.
