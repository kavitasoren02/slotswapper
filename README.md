# SlotSwapper - Peer-to-Peer Time Slot Scheduling Application

A full-stack web application that enables users to swap time slots with each other. Users can mark their busy calendar slots as "swappable" and browse other users' available slots to request swaps.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Context API
- **Backend**: Express.js + Node.js + MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Features

✅ User Authentication (Sign Up/Log In with JWT)
✅ Calendar Management (Create, Read, Update, Delete events)
✅ Slot Swapping System (Request, Accept, Reject swaps)
✅ Marketplace View (Browse available swappable slots)
✅ Notifications/Requests (Track incoming and outgoing swap requests)
✅ Protected Routes (Authenticated access only)
✅ Real-time State Management (Context API)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   MONGO_URI=mongodb://localhost:27017/slotswapper
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Log in and get JWT token

### Events
- `GET /api/events` - Get all events for logged-in user
- `POST /api/events` - Create a new event
- `PATCH /api/events/:eventId` - Update event status
- `DELETE /api/events/:eventId` - Delete an event

### Swap Management
- `GET /api/swaps/swappable-slots` - Get all swappable slots from other users
- `POST /api/swaps/swap-request` - Create a swap request
- `GET /api/swaps/incoming-requests` - Get incoming swap requests
- `GET /api/swaps/outgoing-requests` - Get outgoing swap requests
- `POST /api/swaps/swap-response/:requestId` - Accept or reject a swap request

## Project Structure

```
SlotSwapper/
├── Backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── SwapRequest.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── swaps.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── EventsContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Marketplace.jsx
    │   │   └── Requests.jsx
    │   ├── styles/
    │   │   └── globals.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Usage Guide

1. **Sign Up**: Create a new account with your name, email, and password
2. **Dashboard**: View your calendar and create new events
3. **Make Swappable**: Toggle event status to "SWAPPABLE" to offer it for swap
4. **Marketplace**: Browse other users' swappable slots
5. **Request Swap**: Select a slot from the marketplace and choose your slot to offer
6. **Requests**: Manage incoming and outgoing swap requests
7. **Accept/Reject**: Accept or reject incoming swap requests

## Key Implementation Details

### Authentication Flow
- JWT tokens are stored in localStorage
- Tokens are sent as Bearer tokens in Authorization header
- Tokens expire after 7 days

### Swap Logic
- Only SWAPPABLE slots can be offered in swap requests
- Both slots are marked as SWAP_PENDING when a request is created
- If rejected, slots return to SWAPPABLE status
- If accepted, slot ownership is transferred and both slots return to BUSY status

### State Management
- Uses React Context API for global state (Auth and Events)
- All API calls trigger state updates automatically
- Protected routes ensure authenticated access only

## Assumptions & Design Decisions

1. **Simple Authentication**: Used JWT with localStorage (suitable for MVP, not production)
2. **No Email Verification**: Sign-up is immediate without email confirmation
3. **Calendar View**: Simple list view instead of full calendar grid (easily extendable)
4. **Timezone**: Uses browser's local timezone (no timezone conversion)
5. **UI**: Minimal custom styling using Tailwind CSS only (no UI libraries)




