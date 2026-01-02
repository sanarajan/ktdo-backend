# Driver Membership App - Backend

Independent backend API for the Driver Membership Application.

## Setup

```bash
npm install
```

## Database

Start the local MongoDB server:

```bash
npm run db:start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/driver-app
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Development

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Seed Data

Seed locations (states and districts):
```bash
npm run seed:locations
```

## API Endpoints

- `POST /api/auth/register` - Register new driver
- `POST /api/auth/login` - Login
- `GET /api/locations` - Get all locations
- `GET /api/admin/members` - Get all members (Admin only)
- `POST /api/admin/district-admin` - Create district admin (Main Admin only)

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (File uploads)
- Winston (Logging)
